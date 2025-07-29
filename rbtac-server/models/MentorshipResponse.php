<?php
class MentorshipResponse
{
    private $conn;
    private $table = 'mentorship_responses';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get responses by session
    public function getBySessionId($sessionId)
    {
        $query = "SELECT r.*, q.question_text, q.question_type, q.options, q.is_required
                  FROM {$this->table} r
                  LEFT JOIN mentorship_questions q ON r.question_id = q.id
                  WHERE r.session_id = :session_id
                  ORDER BY q.sort_order, q.id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $sessionId, PDO::PARAM_INT);
        $stmt->execute();
        $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Parse JSON options
        foreach ($responses as &$response) {
            if ($response['options']) {
                $response['options'] = json_decode($response['options'], true);
            }
        }

        return $responses;
    }

    // Get response by ID
    public function getById($id)
    {
        $query = "SELECT r.*, q.question_text, q.question_type, q.options
                  FROM {$this->table} r
                  LEFT JOIN mentorship_questions q ON r.question_id = q.id
                  WHERE r.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $response = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($response && $response['options']) {
            $response['options'] = json_decode($response['options'], true);
        }

        return $response;
    }

    // Create or update response
    public function upsert($data)
    {
        // Validate required fields
        if (empty($data['session_id']) || empty($data['question_id'])) {
            return ['success' => false, 'message' => 'Session ID and question ID are required'];
        }

        // Get question details for validation
        $questionQuery = "SELECT * FROM mentorship_questions WHERE id = :question_id";
        $stmt = $this->conn->prepare($questionQuery);
        $stmt->bindParam(':question_id', $data['question_id'], PDO::PARAM_INT);
        $stmt->execute();
        $question = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$question) {
            return ['success' => false, 'message' => 'Question not found'];
        }

        // Validate response based on question type
        $validationResult = $this->validateResponse($question, $data);
        if (!$validationResult['valid']) {
            return ['success' => false, 'message' => $validationResult['message']];
        }

        // Check if response already exists
        $existingQuery = "SELECT id FROM {$this->table} WHERE session_id = :session_id AND question_id = :question_id";
        $stmt = $this->conn->prepare($existingQuery);
        $stmt->bindParam(':session_id', $data['session_id'], PDO::PARAM_INT);
        $stmt->bindParam(':question_id', $data['question_id'], PDO::PARAM_INT);
        $stmt->execute();
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            return $this->update($existing['id'], $data);
        } else {
            return $this->create($data);
        }
    }

    // Create new response
    private function create($data)
    {
        $query = "INSERT INTO {$this->table} (session_id, question_id, response_text, numeric_value, date_value, boolean_value)
                  VALUES (:session_id, :question_id, :response_text, :numeric_value, :date_value, :boolean_value)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':session_id', $data['session_id'], PDO::PARAM_INT);
        $stmt->bindParam(':question_id', $data['question_id'], PDO::PARAM_INT);
        $stmt->bindParam(':response_text', $data['response_text']);
        $stmt->bindParam(':numeric_value', $data['numeric_value']);
        $stmt->bindParam(':date_value', $data['date_value']);
        $stmt->bindParam(':boolean_value', $data['boolean_value'], PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            $id = $this->conn->lastInsertId();
            return [
                'success' => true,
                'message' => 'Response created successfully',
                'id' => $id,
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to create response'];
    }

    // Update response
    private function update($id, $data)
    {
        $query = "UPDATE {$this->table} SET response_text = :response_text, numeric_value = :numeric_value,
                  date_value = :date_value, boolean_value = :boolean_value WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':response_text', $data['response_text']);
        $stmt->bindParam(':numeric_value', $data['numeric_value']);
        $stmt->bindParam(':date_value', $data['date_value']);
        $stmt->bindParam(':boolean_value', $data['boolean_value'], PDO::PARAM_BOOL);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Response updated successfully',
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to update response'];
    }

    // Validate response based on question type
    private function validateResponse($question, $data)
    {
        // Check if required field is empty
        if ($question['is_required']) {
            $isEmpty = empty($data['response_text']) &&
                      empty($data['numeric_value']) &&
                      empty($data['date_value']) &&
                      is_null($data['boolean_value']);

            if ($isEmpty) {
                return ['valid' => false, 'message' => 'This field is required'];
            }
        }

        switch ($question['question_type']) {
            case 'number':
                if (!empty($data['numeric_value']) && !is_numeric($data['numeric_value'])) {
                    return ['valid' => false, 'message' => 'Invalid numeric value'];
                }
                break;

            case 'date':
                if (!empty($data['date_value']) && !strtotime($data['date_value'])) {
                    return ['valid' => false, 'message' => 'Invalid date format'];
                }
                break;

            case 'boolean':
                if (!is_null($data['boolean_value']) && !is_bool($data['boolean_value']) &&
                    !in_array($data['boolean_value'], [0, 1, '0', '1'])) {
                    return ['valid' => false, 'message' => 'Invalid boolean value'];
                }
                break;

            case 'dropdown':
                if (!empty($data['response_text']) && !empty($question['options'])) {
                    $options = json_decode($question['options'], true);
                    if (is_array($options) && !in_array($data['response_text'], $options)) {
                        return ['valid' => false, 'message' => 'Invalid dropdown selection'];
                    }
                }
                break;
        }

        return ['valid' => true, 'message' => ''];
    }

    // Save multiple responses (bulk save)
    public function saveMultiple($sessionId, $responses)
    {
        try {
            $this->conn->beginTransaction();
            $results = [];

            foreach ($responses as $response) {
                $response['session_id'] = $sessionId;
                $result = $this->upsert($response);
                $results[] = $result;

                if (!$result['success']) {
                    throw new Exception($result['message']);
                }
            }

            $this->conn->commit();
            return [
                'success' => true,
                'message' => 'All responses saved successfully',
                'results' => $results
            ];
        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'Failed to save responses: ' . $e->getMessage()];
        }
    }

    // Get response statistics
    public function getStatistics($sessionId = null, $questionId = null)
    {
        $conditions = [];
        $params = [];

        if ($sessionId) {
            $conditions[] = "r.session_id = :session_id";
            $params[':session_id'] = $sessionId;
        }

        if ($questionId) {
            $conditions[] = "r.question_id = :question_id";
            $params[':question_id'] = $questionId;
        }

        $whereClause = !empty($conditions) ? "WHERE " . implode(" AND ", $conditions) : "";

        $query = "SELECT
                    COUNT(*) as total_responses,
                    COUNT(DISTINCT r.session_id) as unique_sessions,
                    COUNT(DISTINCT r.question_id) as unique_questions,
                    SUM(CASE WHEN r.numeric_value IS NOT NULL THEN 1 ELSE 0 END) as numeric_responses,
                    AVG(r.numeric_value) as avg_numeric_value
                  FROM {$this->table} r
                  {$whereClause}";

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
