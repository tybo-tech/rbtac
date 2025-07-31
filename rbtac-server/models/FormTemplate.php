<?php
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
}
