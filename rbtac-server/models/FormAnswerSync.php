<?php

include_once 'FormAnswer.php';

class FormAnswerSync extends QueryExecutor
{
    private $formAnswer;
    private $lastSyncStats = null;

    public function __construct($db)
    {
        parent::__construct($db);
        $this->formAnswer = new FormAnswer($db);
    }

    /**
     * Get statistics from the last sync operation
     */
    public function getLastSyncStats()
    {
        return $this->lastSyncStats;
    }

    /**
     * Sync form answers from session values
     * This is the main method called after session save/update
     */
    public function syncSessionAnswers($sessionId, $templateId, $values, $structure, $createdBy = null, $logSync = false)
    {
        try {
            // Start transaction for atomic operation
            $this->_conn->beginTransaction();

            // Step 1: Delete existing answers for this session
            $deletedCount = $this->formAnswer->deleteAnswersBySession($sessionId);
            if ($logSync) {
                error_log("FormAnswerSync: Deleted $deletedCount answers for session $sessionId");
            }

            // Step 2: Flatten values into answer format
            $flattenedAnswers = $this->flattenFormValues($sessionId, $templateId, $values, $structure, $createdBy);

            // Step 3: Bulk insert new answers
            if (!empty($flattenedAnswers)) {
                $this->formAnswer->bulkInsertAnswers($flattenedAnswers);
                if ($logSync) {
                    $insertedCount = count($flattenedAnswers);
                    error_log("FormAnswerSync: Inserted $insertedCount answers for session $sessionId");
                }
            }

            $this->_conn->commit();

            if ($logSync) {
                error_log("FormAnswerSync: Successfully synced session $sessionId");
            }

            $syncStats = [
                'success' => true,
                'session_id' => $sessionId,
                'template_id' => $templateId,
                'deleted_count' => $deletedCount ?? 0,
                'inserted_count' => count($flattenedAnswers),
                'sync_time' => date('Y-m-d H:i:s'),
                'created_by' => $createdBy
            ];

            // Store for getLastSyncStats()
            $this->lastSyncStats = $syncStats;

            return $syncStats;

        } catch (Exception $e) {
            $this->_conn->rollBack();
            if ($logSync) {
                error_log("FormAnswerSync: Error syncing session $sessionId - " . $e->getMessage());
            }
            throw $e;
        }
    }

    /**
     * Convert session values into flat answer records
     */
    private function flattenFormValues($sessionId, $templateId, $values, $structure, $createdBy = null)
    {
        $answers = [];

        foreach ($structure['groups'] as $group) {
            $groupKey = $group['key'];
            $groupValues = $values[$groupKey] ?? [];

            foreach ($group['fields'] as $field) {
                $fieldKey = $field['key'];
                $fieldValue = $groupValues[$fieldKey] ?? null;

                if ($fieldValue === null || $fieldValue === '') {
                    continue; // Skip empty values
                }

                // Handle different field types
                if ($field['type'] === 'table' && isset($field['columns'])) {
                    // Handle table fields (like SWOT, Executive Summary)
                    $this->flattenTableField($answers, $sessionId, $templateId, $groupKey, $fieldKey,
                                           $fieldValue, $field['columns'], $createdBy);
                } else {
                    // Handle simple fields (text, number, select, etc.)
                    $this->flattenSimpleField($answers, $sessionId, $templateId, $groupKey, $fieldKey,
                                            $fieldValue, $field['type'], $createdBy);
                }
            }
        }

        return $answers;
    }

    /**
     * Flatten simple field (text, number, select, etc.)
     */
    private function flattenSimpleField(&$answers, $sessionId, $templateId, $groupKey, $fieldKey,
                                      $value, $fieldType, $createdBy)
    {
        $answers[] = (object)[
            'form_session_id' => $sessionId,
            'form_template_id' => $templateId,
            'group_key' => $groupKey,
            'field_key' => $fieldKey,
            'row_index' => null,
            'column_key' => null,
            'value' => is_array($value) ? json_encode($value) : $value,
            'value_type' => $this->determineValueType($value, $fieldType),
            'created_by' => $createdBy,
            'status_id' => 1
        ];
    }

    /**
     * Flatten table field (SWOT, Executive Summary, etc.)
     */
    private function flattenTableField(&$answers, $sessionId, $templateId, $groupKey, $fieldKey,
                                     $tableData, $columns, $createdBy)
    {
        if (!is_array($tableData)) {
            return;
        }

        foreach ($tableData as $rowIndex => $rowData) {
            if (!is_array($rowData)) {
                continue;
            }

            foreach ($columns as $column) {
                $columnKey = $column['key'];
                $cellValue = $rowData[$columnKey] ?? null;

                if ($cellValue === null || $cellValue === '') {
                    continue;
                }

                $answers[] = (object)[
                    'form_session_id' => $sessionId,
                    'form_template_id' => $templateId,
                    'group_key' => $groupKey,
                    'field_key' => $fieldKey,
                    'row_index' => $rowIndex,
                    'column_key' => $columnKey,
                    'value' => is_array($cellValue) ? json_encode($cellValue) : $cellValue,
                    'value_type' => $this->determineValueType($cellValue, $column['type'] ?? 'text'),
                    'created_by' => $createdBy,
                    'status_id' => 1
                ];
            }
        }
    }

    /**
     * Determine value type for proper storage and analytics
     */
    private function determineValueType($value, $fieldType)
    {
        if (is_array($value)) {
            return 'json';
        }

        switch ($fieldType) {
            case 'number':
                return 'number';
            case 'date':
                return 'date';
            case 'boolean':
            case 'checkbox':
                return 'boolean';
            case 'select':
                return 'select';
            default:
                return 'text';
        }
    }

    /**
     * Resync all sessions for a template (useful when structure changes)
     */
    public function resyncTemplate($templateId)
    {
        $formSession = new FormSession($this->_conn);
        $formTemplate = new FormTemplate($this->_conn);

        $template = $formTemplate->getFormTemplateById($templateId);
        if (!$template) {
            throw new Exception("Template not found");
        }

        $sessions = $formSession->getSessionsByTemplate($templateId);

        foreach ($sessions as $session) {
            $this->syncSessionAnswers(
                $session['id'],
                $templateId,
                $session['values'],
                $template['structure'],
                $session['updated_by']
            );
        }

        return count($sessions);
    }
}
