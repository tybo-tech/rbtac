<?php
class FormSession extends QueryExecutor
{
  public function addFormSession($formSession)
  {
    $query = "INSERT INTO form_sessions (
            form_template_id, company_id, user_id, values,
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
    return $this->_conn->lastInsertId();
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

  public function updateFormSession($formSession)
  {
    $query = "UPDATE form_sessions SET
            form_template_id = :form_template_id,
            company_id = :company_id,
            user_id = :user_id,
            values = :values,
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
    $query = "UPDATE form_sessions SET values = :values, updated_by = :updated_by WHERE id = :id";
    $params = [
      ':values' => json_encode($values),
      ':updated_by' => $updatedBy,
      ':id' => $sessionId
    ];
    $this->executeQuery($query, $params);
  }
}
