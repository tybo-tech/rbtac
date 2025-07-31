<?php

include_once 'Database.php';

class FormSession extends QueryExecutor
{
  public function addFormSession($formSession, $syncAnswers = true)
  {
    $query = "INSERT INTO form_sessions (
            form_template_id, company_id, user_id, `values`,
            created_by, status_id
        ) VALUES (
            :form_template_id, :company_id, :user_id, :values,
            :created_by, :status_id
        )";

    $params = [
      ':form_template_id' => $formSession->form_template_id,
      ':company_id' => $formSession->company_id,
      ':user_id' => $formSession->user_id,
      ':values' => json_encode($formSession->values ?? []),
      ':created_by' => $formSession->created_by ?? null,
      ':status_id' => $formSession->status_id ?? 1,
    ];

    $this->executeQuery($query, $params);
    $sessionId = $this->_conn->lastInsertId();

    // Auto-sync answers if enabled and values exist
    if ($syncAnswers && !empty($formSession->values) && !empty($formSession->template_structure)) {
      $sync = $this->getFormAnswerSync();
      $sync->syncSessionAnswers(
        $sessionId,
        $formSession->form_template_id,
        $formSession->values,
        $formSession->template_structure,
        $formSession->created_by
      );
    }

    return $sessionId;
  }

  public function getFormSessionById($sessionId)
  {
    $query = "SELECT * FROM form_sessions WHERE id = :id";
    $params = [':id' => $sessionId];

    $result = $this->executeQuery($query, $params);
    $session = $result->fetch(PDO::FETCH_ASSOC);
    if ($session) {
      $session['values'] = json_decode($session['values'], true);
    }
    return $session;
  }

  public function updateFormSession($formSession, $syncAnswers = true)
  {
    $query = "UPDATE form_sessions SET
            form_template_id = :form_template_id,
            company_id = :company_id,
            user_id = :user_id,
            `values` = :values,
            updated_by = :updated_by,
            status_id = :status_id
        WHERE id = :id";

    $params = [
      ':form_template_id' => $formSession->form_template_id,
      ':company_id' => $formSession->company_id,
      ':user_id' => $formSession->user_id,
      ':values' => json_encode($formSession->values ?? []),
      ':updated_by' => $formSession->updated_by ?? null,
      ':status_id' => $formSession->status_id ?? 1,
      ':id' => $formSession->id,
    ];

    $this->executeQuery($query, $params);

    // Auto-sync answers if enabled and values exist
    if ($syncAnswers && !empty($formSession->values) && !empty($formSession->template_structure)) {
      $sync = $this->getFormAnswerSync();
      $sync->syncSessionAnswers(
        $formSession->id,
        $formSession->form_template_id,
        $formSession->values,
        $formSession->template_structure,
        $formSession->updated_by
      );
    }
  }

  public function list($companyId = null, $templateId = null, $userId = null)
  {
    $query = "SELECT * FROM form_sessions";
    $params = [];
    $conditions = [];

    if ($companyId) {
      $conditions[] = "company_id = :company_id";
      $params[':company_id'] = $companyId;
    }

    if ($templateId) {
      $conditions[] = "form_template_id = :form_template_id";
      $params[':form_template_id'] = $templateId;
    }

    if ($userId) {
      $conditions[] = "user_id = :user_id";
      $params[':user_id'] = $userId;
    }

    if (!empty($conditions)) {
      $query .= " WHERE " . implode(" AND ", $conditions);
    }

    $query .= " ORDER BY created_at DESC";

    $result = $this->executeQuery($query, $params);
    $sessions = $result->fetchAll(PDO::FETCH_ASSOC);

    foreach ($sessions as &$session) {
      $session['values'] = json_decode($session['values'], true);
    }

    return $sessions;
  }

  public function deleteFormSession($sessionId)
  {
    $query = "DELETE FROM form_sessions WHERE id = :id";
    $params = [':id' => $sessionId];
    $this->executeQuery($query, $params);
  }

  public function deleteFormSessionWithAnswers($sessionId)
  {
    try {
      $this->_conn->beginTransaction();

      // Explicitly delete answers first (safety net even with CASCADE)
      include_once 'FormAnswerSync.php';
      include_once 'FormAnswer.php';
      $answerService = new FormAnswer($this->_conn);
      $answerService->deleteAnswersBySession($sessionId);

      // Then delete the session
      $this->deleteFormSession($sessionId);

      $this->_conn->commit();
      return true;

    } catch (Exception $e) {
      $this->_conn->rollBack();
      throw $e;
    }
  }

  public function getSessionsByTemplate($templateId)
  {
    return $this->list(null, $templateId);
  }

  public function getSessionsByCompany($companyId)
  {
    return $this->list($companyId);
  }

  public function getSessionsByUser($userId)
  {
    return $this->list(null, null, $userId);
  }

  public function archiveFormSession($sessionId, $updatedBy = null)
  {
    $query = "UPDATE form_sessions SET status_id = 0, updated_by = :updated_by WHERE id = :id";
    $params = [
      ':id' => $sessionId,
      ':updated_by' => $updatedBy
    ];
    $this->executeQuery($query, $params);
  }

  public function getSessionWithTemplate($sessionId)
  {
    $query = "SELECT
                fs.*,
                ft.title as template_title,
                ft.description as template_description,
                ft.structure as template_structure
              FROM form_sessions fs
              LEFT JOIN form_templates ft ON fs.form_template_id = ft.id
              WHERE fs.id = :id";

    $params = [':id' => $sessionId];
    $result = $this->executeQuery($query, $params);
    $session = $result->fetch(PDO::FETCH_ASSOC);

    if ($session) {
      $session['values'] = json_decode($session['values'], true);
      $session['template_structure'] = json_decode($session['template_structure'], true);
    }

    return $session;
  }

  public function updateSessionValues($sessionId, $values, $updatedBy = null)
  {
    $query = "UPDATE form_sessions SET `values` = :values, updated_by = :updated_by WHERE id = :id";
    $params = [
      ':values' => json_encode($values),
      ':updated_by' => $updatedBy,
      ':id' => $sessionId
    ];
    $this->executeQuery($query, $params);
  }

  /**
   * Centralized method to ensure FormAnswerSync is available
   */
  private function getFormAnswerSync()
  {
    include_once 'FormAnswerSync.php';
    return new FormAnswerSync($this->_conn);
  }

  /**
   * Sync answers for a session (can be called independently)
   */
  public function syncSessionAnswers($sessionId, $templateId, $values, $structure, $userId = null)
  {
    $sync = $this->getFormAnswerSync();
    return $sync->syncSessionAnswers($sessionId, $templateId, $values, $structure, $userId);
  }

  /**
   * Update session values and sync answers in one operation
   */
  public function updateSessionValuesWithSync($sessionId, $values, $templateStructure, $updatedBy = null)
  {
    try {
      $this->_conn->beginTransaction();

      // Update session values
      $this->updateSessionValues($sessionId, $values, $updatedBy);

      // Get template ID for sync
      $session = $this->getFormSessionById($sessionId);
      if ($session) {
        $this->syncSessionAnswers($sessionId, $session['form_template_id'], $values, $templateStructure, $updatedBy);
      }

      $this->_conn->commit();
      return true;

    } catch (Exception $e) {
      $this->_conn->rollBack();
      throw $e;
    }
  }
}
