<?php
class MentorshipSession
{
    private $conn;
    private $table = 'mentorship_sessions';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all sessions
    public function getAll()
    {
        $query = "SELECT s.*, c.name as company_name, t.title as template_title, u.name as created_by_name
                  FROM {$this->table} s
                  LEFT JOIN companies c ON s.company_id = c.id
                  LEFT JOIN mentorship_templates t ON s.template_id = t.id
                  LEFT JOIN users u ON s.created_by = u.id
                  ORDER BY s.session_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get sessions by company
    public function getByCompanyId($companyId)
    {
        $query = "SELECT s.*, t.title as template_title, u.name as created_by_name
                  FROM {$this->table} s
                  LEFT JOIN mentorship_templates t ON s.template_id = t.id
                  LEFT JOIN users u ON s.created_by = u.id
                  WHERE s.company_id = :company_id
                  ORDER BY s.session_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':company_id', $companyId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get session by ID
    public function getById($id)
    {
        $query = "SELECT s.*, c.name as company_name, t.title as template_title, u.name as created_by_name
                  FROM {$this->table} s
                  LEFT JOIN companies c ON s.company_id = c.id
                  LEFT JOIN mentorship_templates t ON s.template_id = t.id
                  LEFT JOIN users u ON s.created_by = u.id
                  WHERE s.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get session with responses and tasks
    public function getWithDetails($id)
    {
        $session = $this->getById($id);
        if (!$session) {
            return null;
        }

        // Get responses
        $query = "SELECT r.*, q.question_text, q.question_type, q.options
                  FROM mentorship_responses r
                  LEFT JOIN mentorship_questions q ON r.question_id = q.id
                  WHERE r.session_id = :session_id
                  ORDER BY q.sort_order, q.id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $responses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Parse JSON options for questions
        foreach ($responses as &$response) {
            if ($response['options']) {
                $response['options'] = json_decode($response['options'], true);
            }
        }

        // Get tasks
        $query = "SELECT t.*, u.name as assigned_to_name
                  FROM mentorship_tasks t
                  LEFT JOIN users u ON t.assigned_to = u.id
                  WHERE t.session_id = :session_id
                  ORDER BY t.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $session['responses'] = $responses;
        $session['tasks'] = $tasks;

        return $session;
    }

    // Create new session
    public function create($data)
    {
        // Validate required fields
        if (empty($data['company_id']) || empty($data['template_id'])) {
            return ['success' => false, 'message' => 'Company ID and template ID are required'];
        }

        // Validate company exists
        $query = "SELECT id FROM companies WHERE id = :company_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':company_id', $data['company_id'], PDO::PARAM_INT);
        $stmt->execute();
        if (!$stmt->fetch()) {
            return ['success' => false, 'message' => 'Company not found'];
        }

        // Validate template exists
        $query = "SELECT id FROM mentorship_templates WHERE id = :template_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':template_id', $data['template_id'], PDO::PARAM_INT);
        $stmt->execute();
        if (!$stmt->fetch()) {
            return ['success' => false, 'message' => 'Template not found'];
        }

        $sessionDate = !empty($data['session_date']) ? $data['session_date'] : date('Y-m-d H:i:s');

        $query = "INSERT INTO {$this->table} (company_id, template_id, session_date, notes, created_by)
                  VALUES (:company_id, :template_id, :session_date, :notes, :created_by)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':company_id', $data['company_id'], PDO::PARAM_INT);
        $stmt->bindParam(':template_id', $data['template_id'], PDO::PARAM_INT);
        $stmt->bindParam(':session_date', $sessionDate);
        $stmt->bindParam(':notes', $data['notes']);
        $stmt->bindParam(':created_by', $data['created_by'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            $id = $this->conn->lastInsertId();
            return [
                'success' => true,
                'message' => 'Session created successfully',
                'id' => $id,
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to create session'];
    }

    // Update session
    public function update($id, $data)
    {
        $query = "UPDATE {$this->table} SET session_date = :session_date, notes = :notes WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $sessionDate = !empty($data['session_date']) ? $data['session_date'] : date('Y-m-d H:i:s');

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':session_date', $sessionDate);
        $stmt->bindParam(':notes', $data['notes']);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Session updated successfully',
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to update session'];
    }

    // Get sessions by template
    public function getByTemplateId($templateId)
    {
        $query = "SELECT s.*, c.name as company_name, u.name as created_by_name
                  FROM {$this->table} s
                  LEFT JOIN companies c ON s.company_id = c.id
                  LEFT JOIN users u ON s.created_by = u.id
                  WHERE s.template_id = :template_id
                  ORDER BY s.session_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':template_id', $templateId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get recent sessions
    public function getRecent($limit = 10)
    {
        $query = "SELECT s.*, c.name as company_name, t.title as template_title, u.name as created_by_name
                  FROM {$this->table} s
                  LEFT JOIN companies c ON s.company_id = c.id
                  LEFT JOIN mentorship_templates t ON s.template_id = t.id
                  LEFT JOIN users u ON s.created_by = u.id
                  ORDER BY s.session_date DESC
                  LIMIT :limit";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get session statistics
    public function getStatistics($companyId = null, $templateId = null)
    {
        $conditions = [];
        $params = [];

        if ($companyId) {
            $conditions[] = "s.company_id = :company_id";
            $params[':company_id'] = $companyId;
        }

        if ($templateId) {
            $conditions[] = "s.template_id = :template_id";
            $params[':template_id'] = $templateId;
        }

        $whereClause = !empty($conditions) ? "WHERE " . implode(" AND ", $conditions) : "";

        $query = "SELECT
                    COUNT(*) as total_sessions,
                    COUNT(DISTINCT s.company_id) as unique_companies,
                    COUNT(DISTINCT s.template_id) as templates_used,
                    AVG(TIMESTAMPDIFF(MINUTE, s.session_date, NOW())) as avg_age_minutes
                  FROM {$this->table} s
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
