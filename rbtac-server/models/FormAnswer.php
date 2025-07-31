<?php
class FormAnswer extends QueryExecutor
{
  public function addFormAnswer($formAnswer)
  {
    $query = "INSERT INTO form_answers (
            form_session_id, form_template_id, group_key, field_key,
            row_index, column_key, value, value_type,
            created_by, status_id
        ) VALUES (
            :form_session_id, :form_template_id, :group_key, :field_key,
            :row_index, :column_key, :value, :value_type,
            :created_by, :status_id
        )";

    $params = [
      ':form_session_id' => $formAnswer->form_session_id,
      ':form_template_id' => $formAnswer->form_template_id,
      ':group_key' => $formAnswer->group_key,
      ':field_key' => $formAnswer->field_key,
      ':row_index' => $formAnswer->row_index ?? null,
      ':column_key' => $formAnswer->column_key ?? null,
      ':value' => $formAnswer->value,
      ':value_type' => $formAnswer->value_type ?? 'text',
      ':created_by' => $formAnswer->created_by ?? null,
      ':status_id' => $formAnswer->status_id ?? 1,
    ];

    $this->executeQuery($query, $params);
    return $this->_conn->lastInsertId();
  }

  public function getFormAnswerById($answerId)
  {
    $query = "SELECT * FROM form_answers WHERE id = :id";
    $params = [':id' => $answerId];

    $result = $this->executeQuery($query, $params);
    return $result->fetch(PDO::FETCH_ASSOC);
  }

  public function updateFormAnswer($formAnswer)
  {
    $query = "UPDATE form_answers SET
            form_session_id = :form_session_id,
            form_template_id = :form_template_id,
            group_key = :group_key,
            field_key = :field_key,
            row_index = :row_index,
            column_key = :column_key,
            value = :value,
            value_type = :value_type,
            updated_by = :updated_by,
            status_id = :status_id
        WHERE id = :id";

    $params = [
      ':form_session_id' => $formAnswer->form_session_id,
      ':form_template_id' => $formAnswer->form_template_id,
      ':group_key' => $formAnswer->group_key,
      ':field_key' => $formAnswer->field_key,
      ':row_index' => $formAnswer->row_index ?? null,
      ':column_key' => $formAnswer->column_key ?? null,
      ':value' => $formAnswer->value,
      ':value_type' => $formAnswer->value_type ?? 'text',
      ':updated_by' => $formAnswer->updated_by ?? null,
      ':status_id' => $formAnswer->status_id ?? 1,
      ':id' => $formAnswer->id,
    ];

    $this->executeQuery($query, $params);
  }

  public function getAnswersBySession($sessionId)
  {
    $query = "SELECT * FROM form_answers WHERE form_session_id = :session_id ORDER BY group_key, field_key, row_index, column_key";
    $params = [':session_id' => $sessionId];

    $result = $this->executeQuery($query, $params);
    return $result->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getAnswersByTemplate($templateId)
  {
    $query = "SELECT * FROM form_answers WHERE form_template_id = :template_id ORDER BY form_session_id, group_key, field_key";
    $params = [':template_id' => $templateId];

    $result = $this->executeQuery($query, $params);
    return $result->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getAnswersByField($templateId, $groupKey, $fieldKey)
  {
    $query = "SELECT * FROM form_answers
              WHERE form_template_id = :template_id
              AND group_key = :group_key
              AND field_key = :field_key
              ORDER BY form_session_id, row_index, column_key";

    $params = [
      ':template_id' => $templateId,
      ':group_key' => $groupKey,
      ':field_key' => $fieldKey
    ];

    $result = $this->executeQuery($query, $params);
    return $result->fetchAll(PDO::FETCH_ASSOC);
  }

  public function deleteFormAnswer($answerId)
  {
    $query = "DELETE FROM form_answers WHERE id = :id";
    $params = [':id' => $answerId];
    $this->executeQuery($query, $params);
  }

  public function deleteAnswersBySession($sessionId)
  {
    $query = "DELETE FROM form_answers WHERE form_session_id = :session_id";
    $params = [':session_id' => $sessionId];
    $this->executeQuery($query, $params);
  }

  public function upsertFormAnswer($formAnswer)
  {
    // Check if answer exists
    $existingAnswer = $this->getExistingAnswer(
      $formAnswer->form_session_id,
      $formAnswer->group_key,
      $formAnswer->field_key,
      $formAnswer->row_index,
      $formAnswer->column_key
    );

    if ($existingAnswer) {
      $formAnswer->id = $existingAnswer['id'];
      $this->updateFormAnswer($formAnswer);
      return $existingAnswer['id'];
    } else {
      return $this->addFormAnswer($formAnswer);
    }
  }

  private function getExistingAnswer($sessionId, $groupKey, $fieldKey, $rowIndex = null, $columnKey = null)
  {
    $query = "SELECT id FROM form_answers
              WHERE form_session_id = :session_id
              AND group_key = :group_key
              AND field_key = :field_key";

    $params = [
      ':session_id' => $sessionId,
      ':group_key' => $groupKey,
      ':field_key' => $fieldKey
    ];

    if ($rowIndex !== null) {
      $query .= " AND row_index = :row_index";
      $params[':row_index'] = $rowIndex;
    } else {
      $query .= " AND row_index IS NULL";
    }

    if ($columnKey !== null) {
      $query .= " AND column_key = :column_key";
      $params[':column_key'] = $columnKey;
    } else {
      $query .= " AND column_key IS NULL";
    }

    $result = $this->executeQuery($query, $params);
    return $result->fetch(PDO::FETCH_ASSOC);
  }

  public function bulkInsertAnswers($answers)
  {
    if (empty($answers)) return;

    $query = "INSERT INTO form_answers (
                form_session_id, form_template_id, group_key, field_key,
                row_index, column_key, value, value_type,
                created_by, status_id
              ) VALUES ";

    $valueStrings = [];
    $params = [];
    $index = 0;

    foreach ($answers as $answer) {
      $valueStrings[] = "(
        :form_session_id_$index, :form_template_id_$index, :group_key_$index, :field_key_$index,
        :row_index_$index, :column_key_$index, :value_$index, :value_type_$index,
        :created_by_$index, :status_id_$index
      )";

      $params[":form_session_id_$index"] = $answer->form_session_id;
      $params[":form_template_id_$index"] = $answer->form_template_id;
      $params[":group_key_$index"] = $answer->group_key;
      $params[":field_key_$index"] = $answer->field_key;
      $params[":row_index_$index"] = $answer->row_index ?? null;
      $params[":column_key_$index"] = $answer->column_key ?? null;
      $params[":value_$index"] = $answer->value;
      $params[":value_type_$index"] = $answer->value_type ?? 'text';
      $params[":created_by_$index"] = $answer->created_by ?? null;
      $params[":status_id_$index"] = $answer->status_id ?? 1;

      $index++;
    }

    $query .= implode(', ', $valueStrings);
    $this->executeQuery($query, $params);
  }

  // Analytics and reporting methods
  public function getFieldValueAnalytics($templateId, $groupKey, $fieldKey)
  {
    $query = "SELECT
                value,
                value_type,
                COUNT(*) as count,
                COUNT(DISTINCT form_session_id) as unique_sessions
              FROM form_answers
              WHERE form_template_id = :template_id
              AND group_key = :group_key
              AND field_key = :field_key
              GROUP BY value, value_type
              ORDER BY count DESC";

    $params = [
      ':template_id' => $templateId,
      ':group_key' => $groupKey,
      ':field_key' => $fieldKey
    ];

    $result = $this->executeQuery($query, $params);
    return $result->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getNumericFieldStats($templateId, $groupKey, $fieldKey)
  {
    $query = "SELECT
                COUNT(*) as count,
                AVG(CAST(value AS DECIMAL(10,2))) as average,
                MIN(CAST(value AS DECIMAL(10,2))) as minimum,
                MAX(CAST(value AS DECIMAL(10,2))) as maximum,
                STDDEV(CAST(value AS DECIMAL(10,2))) as std_deviation
              FROM form_answers
              WHERE form_template_id = :template_id
              AND group_key = :group_key
              AND field_key = :field_key
              AND value_type = 'number'
              AND value REGEXP '^[0-9]+(\.[0-9]+)?$'";

    $params = [
      ':template_id' => $templateId,
      ':group_key' => $groupKey,
      ':field_key' => $fieldKey
    ];

    $result = $this->executeQuery($query, $params);
    return $result->fetch(PDO::FETCH_ASSOC);
  }
}
