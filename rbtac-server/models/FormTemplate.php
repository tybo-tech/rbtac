<?php

include_once 'Database.php';

class FormTemplate extends QueryExecutor
{
  public function addFormTemplate($formTemplate)
  {
    $query = "INSERT INTO form_templates (
            title, description, structure,
            created_by, status_id
        ) VALUES (
            :title, :description, :structure,
            :created_by, :status_id
        )";

    $params = [
      ':title' => $formTemplate->title,
      ':description' => $formTemplate->description ?? null,
      ':structure' => json_encode($formTemplate->structure),
      ':created_by' => $formTemplate->created_by ?? null,
      ':status_id' => $formTemplate->status_id ?? 1,
    ];

    $this->executeQuery($query, $params);
    return $this->_conn->lastInsertId();
  }

  public function getFormTemplateById($templateId)
  {
    $query = "SELECT * FROM form_templates WHERE id = :id";
    $params = [':id' => $templateId];

    $result = $this->executeQuery($query, $params);
    $template = $result->fetch(PDO::FETCH_ASSOC);
    if ($template) {
      $template['structure'] = json_decode($template['structure'], true);
    }
    return $template;
  }

  public function updateFormTemplate($formTemplate)
  {
    $query = "UPDATE form_templates SET
            title = :title,
            description = :description,
            structure = :structure,
            updated_by = :updated_by,
            status_id = :status_id
        WHERE id = :id";

    $params = [
      ':title' => $formTemplate->title,
      ':description' => $formTemplate->description ?? null,
      ':structure' => json_encode($formTemplate->structure),
      ':updated_by' => $formTemplate->updated_by ?? null,
      ':status_id' => $formTemplate->status_id ?? 1,
      ':id' => $formTemplate->id,
    ];

    $this->executeQuery($query, $params);
  }

  public function list($statusId = null)
  {
    $query = "SELECT * FROM form_templates";
    $params = [];

    if ($statusId !== null) {
      $query .= " WHERE status_id = :status_id";
      $params[':status_id'] = $statusId;
    }

    $query .= " ORDER BY created_at DESC";

    $result = $this->executeQuery($query, $params);
    $templates = $result->fetchAll(PDO::FETCH_ASSOC);

    foreach ($templates as &$template) {
      $template['structure'] = json_decode($template['structure'], true);
    }

    return $templates;
  }

  /**
   * Optimized list for UI display - returns only essential fields with summary data
   */
  public function listSummary($statusId = null)
  {
    $query = "SELECT
                id, title, description, status_id,
                created_at, updated_at, created_by, updated_by,
                structure
              FROM form_templates";
    $params = [];

    if ($statusId !== null) {
      $query .= " WHERE status_id = :status_id";
      $params[':status_id'] = $statusId;
    }

    $query .= " ORDER BY created_at DESC";

    $result = $this->executeQuery($query, $params);
    $templates = $result->fetchAll(PDO::FETCH_ASSOC);

    foreach ($templates as &$template) {
      $structure = json_decode($template['structure'], true);

      // Calculate summary stats from structure
      $template['summary'] = $this->calculateTemplateSummary($structure);

      // Remove the heavy structure data for list view
      unset($template['structure']);
    }

    return $templates;
  }

  /**
   * Calculate template summary statistics
   */
  private function calculateTemplateSummary($structure)
  {
    $summary = [
      'group_count' => 0,
      'field_count' => 0,
      'field_types' => [],
      'estimated_time' => 0, // minutes
      'complexity' => 'Simple'
    ];

    if (!is_array($structure) || empty($structure)) {
      return $summary;
    }

    foreach ($structure as $group) {
      if (isset($group['fields']) && is_array($group['fields'])) {
        $summary['group_count']++;

        foreach ($group['fields'] as $field) {
          $summary['field_count']++;

          // Track field types for variety analysis
          $fieldType = $field['type'] ?? 'text';
          if (!isset($summary['field_types'][$fieldType])) {
            $summary['field_types'][$fieldType] = 0;
          }
          $summary['field_types'][$fieldType]++;

          // Estimate time based on field complexity
          switch ($fieldType) {
            case 'textarea':
            case 'file':
              $summary['estimated_time'] += 2;
              break;
            case 'select':
            case 'radio':
            case 'checkbox':
              $summary['estimated_time'] += 1;
              break;
            case 'table':
              $summary['estimated_time'] += 5;
              break;
            default:
              $summary['estimated_time'] += 0.5;
          }
        }
      }
    }

    // Determine complexity
    if ($summary['field_count'] > 20 || $summary['group_count'] > 5) {
      $summary['complexity'] = 'Complex';
    } elseif ($summary['field_count'] > 10 || $summary['group_count'] > 3) {
      $summary['complexity'] = 'Moderate';
    }

    // Round estimated time
    $summary['estimated_time'] = ceil($summary['estimated_time']);

    return $summary;
  }

  public function deleteFormTemplate($templateId)
  {
    $query = "DELETE FROM form_templates WHERE id = :id";
    $params = [':id' => $templateId];
    $this->executeQuery($query, $params);
  }

  public function archiveFormTemplate($templateId, $updatedBy = null)
  {
    $query = "UPDATE form_templates SET status_id = 0, updated_by = :updated_by WHERE id = :id";
    $params = [
      ':id' => $templateId,
      ':updated_by' => $updatedBy
    ];
    $this->executeQuery($query, $params);
  }

  public function getFormTemplateByTitle($title)
  {
    $query = "SELECT * FROM form_templates WHERE title = :title AND status_id = 1";
    $params = [':title' => $title];

    $result = $this->executeQuery($query, $params);
    $template = $result->fetch(PDO::FETCH_ASSOC);
    if ($template) {
      $template['structure'] = json_decode($template['structure'], true);
    }
    return $template;
  }

  public function getActiveTemplates()
  {
    return $this->list(1);
  }

  /**
   * Get template usage statistics
   */
  public function getTemplateStats($templateId)
  {
    include_once 'FormSession.php';
    $formSession = new FormSession($this->_conn);

    $query = "SELECT
                COUNT(*) as total_sessions,
                COUNT(CASE WHEN status_id = 1 THEN 1 END) as active_sessions,
                MIN(created_at) as first_session,
                MAX(updated_at) as last_activity
              FROM form_sessions
              WHERE form_template_id = :template_id";

    $params = [':template_id' => $templateId];
    $result = $this->executeQuery($query, $params);
    $stats = $result->fetch(PDO::FETCH_ASSOC);

    // Get answer count
    $answerQuery = "SELECT COUNT(*) as total_answers
                   FROM form_answers
                   WHERE form_template_id = :template_id";
    $answerResult = $this->executeQuery($answerQuery, $params);
    $answerStats = $answerResult->fetch(PDO::FETCH_ASSOC);

    return array_merge($stats, $answerStats);
  }

  /**
   * Safe template deletion with impact check
   */
  public function deleteFormTemplateWithCheck($templateId, $force = false)
  {
    $stats = $this->getTemplateStats($templateId);

    if ($stats['total_sessions'] > 0 && !$force) {
      throw new Exception("Cannot delete template: {$stats['total_sessions']} sessions exist. Use force=true to override.");
    }

    if ($force) {
      // Delete associated sessions and answers first
      include_once 'FormSession.php';
      $formSession = new FormSession($this->_conn);
      $sessions = $formSession->getSessionsByTemplate($templateId);

      foreach ($sessions as $session) {
        $formSession->deleteFormSessionWithAnswers($session['id']);
      }
    }

    $this->deleteFormTemplate($templateId);
    return true;
  }
}
