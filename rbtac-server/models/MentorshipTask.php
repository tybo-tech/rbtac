<?php
class MentorshipTask
{
    private $conn;
    private $table = 'mentorship_tasks';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all tasks
    public function getAll()
    {
        $query = "SELECT t.*, c.name as company_name, u.name as assigned_to_name,
                         s.session_date, q.question_text
                  FROM {$this->table} t
                  LEFT JOIN companies c ON t.company_id = c.id
                  LEFT JOIN users u ON t.assigned_to = u.id
                  LEFT JOIN mentorship_sessions s ON t.session_id = s.id
                  LEFT JOIN mentorship_questions q ON t.question_id = q.id
                  ORDER BY t.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get tasks by session
    public function getBySessionId($sessionId)
    {
        $query = "SELECT t.*, c.name as company_name, u.name as assigned_to_name, q.question_text
                  FROM {$this->table} t
                  LEFT JOIN companies c ON t.company_id = c.id
                  LEFT JOIN users u ON t.assigned_to = u.id
                  LEFT JOIN mentorship_questions q ON t.question_id = q.id
                  WHERE t.session_id = :session_id
                  ORDER BY t.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $sessionId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get tasks by company
    public function getByCompanyId($companyId)
    {
        $query = "SELECT t.*, u.name as assigned_to_name, s.session_date, q.question_text,
                         mt.title as template_title
                  FROM {$this->table} t
                  LEFT JOIN users u ON t.assigned_to = u.id
                  LEFT JOIN mentorship_sessions s ON t.session_id = s.id
                  LEFT JOIN mentorship_questions q ON t.question_id = q.id
                  LEFT JOIN mentorship_templates mt ON s.template_id = mt.id
                  WHERE t.company_id = :company_id
                  ORDER BY t.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':company_id', $companyId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get tasks by status
    public function getByStatus($status)
    {
        $validStatuses = ['pending', 'in_progress', 'done'];
        if (!in_array($status, $validStatuses)) {
            return [];
        }

        $query = "SELECT t.*, c.name as company_name, u.name as assigned_to_name,
                         s.session_date, q.question_text
                  FROM {$this->table} t
                  LEFT JOIN companies c ON t.company_id = c.id
                  LEFT JOIN users u ON t.assigned_to = u.id
                  LEFT JOIN mentorship_sessions s ON t.session_id = s.id
                  LEFT JOIN mentorship_questions q ON t.question_id = q.id
                  WHERE t.status = :status
                  ORDER BY t.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get task by ID
    public function getById($id)
    {
        $query = "SELECT t.*, c.name as company_name, u.name as assigned_to_name,
                         s.session_date, q.question_text
                  FROM {$this->table} t
                  LEFT JOIN companies c ON t.company_id = c.id
                  LEFT JOIN users u ON t.assigned_to = u.id
                  LEFT JOIN mentorship_sessions s ON t.session_id = s.id
                  LEFT JOIN mentorship_questions q ON t.question_id = q.id
                  WHERE t.id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create new task
    public function create($data)
    {
        // Validate required fields
        if (empty($data['session_id']) || empty($data['company_id']) || empty($data['task_title'])) {
            return ['success' => false, 'message' => 'Session ID, company ID, and task title are required'];
        }

        // Validate session exists
        $query = "SELECT id FROM mentorship_sessions WHERE id = :session_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':session_id', $data['session_id'], PDO::PARAM_INT);
        $stmt->execute();
        if (!$stmt->fetch()) {
            return ['success' => false, 'message' => 'Session not found'];
        }

        // Validate company exists
        $query = "SELECT id FROM companies WHERE id = :company_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':company_id', $data['company_id'], PDO::PARAM_INT);
        $stmt->execute();
        if (!$stmt->fetch()) {
            return ['success' => false, 'message' => 'Company not found'];
        }

        // Validate status
        $status = !empty($data['status']) ? $data['status'] : 'pending';
        $validStatuses = ['pending', 'in_progress', 'done'];
        if (!in_array($status, $validStatuses)) {
            return ['success' => false, 'message' => 'Invalid status'];
        }

        $query = "INSERT INTO {$this->table} (session_id, question_id, company_id, task_title, task_description, assigned_to, status, due_date)
                  VALUES (:session_id, :question_id, :company_id, :task_title, :task_description, :assigned_to, :status, :due_date)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':session_id', $data['session_id'], PDO::PARAM_INT);
        $stmt->bindParam(':question_id', $data['question_id'], PDO::PARAM_INT);
        $stmt->bindParam(':company_id', $data['company_id'], PDO::PARAM_INT);
        $stmt->bindParam(':task_title', $data['task_title']);
        $stmt->bindParam(':task_description', $data['task_description']);
        $stmt->bindParam(':assigned_to', $data['assigned_to'], PDO::PARAM_INT);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':due_date', $data['due_date']);

        if ($stmt->execute()) {
            $id = $this->conn->lastInsertId();
            return [
                'success' => true,
                'message' => 'Task created successfully',
                'id' => $id,
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to create task'];
    }

    // Update task
    public function update($id, $data)
    {
        // Validate required fields
        if (empty($data['task_title'])) {
            return ['success' => false, 'message' => 'Task title is required'];
        }

        // Validate status
        if (!empty($data['status'])) {
            $validStatuses = ['pending', 'in_progress', 'done'];
            if (!in_array($data['status'], $validStatuses)) {
                return ['success' => false, 'message' => 'Invalid status'];
            }
        }

        $query = "UPDATE {$this->table} SET task_title = :task_title, task_description = :task_description,
                  assigned_to = :assigned_to, status = :status, due_date = :due_date WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':task_title', $data['task_title']);
        $stmt->bindParam(':task_description', $data['task_description']);
        $stmt->bindParam(':assigned_to', $data['assigned_to'], PDO::PARAM_INT);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':due_date', $data['due_date']);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Task updated successfully',
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to update task'];
    }

    // Update task status
    public function updateStatus($id, $status)
    {
        $validStatuses = ['pending', 'in_progress', 'done'];
        if (!in_array($status, $validStatuses)) {
            return ['success' => false, 'message' => 'Invalid status'];
        }

        $query = "UPDATE {$this->table} SET status = :status WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Task status updated successfully',
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to update task status'];
    }

    // Get tasks assigned to user
    public function getAssignedToUser($userId)
    {
        $query = "SELECT t.*, c.name as company_name, s.session_date, q.question_text,
                         mt.title as template_title
                  FROM {$this->table} t
                  LEFT JOIN companies c ON t.company_id = c.id
                  LEFT JOIN mentorship_sessions s ON t.session_id = s.id
                  LEFT JOIN mentorship_questions q ON t.question_id = q.id
                  LEFT JOIN mentorship_templates mt ON s.template_id = mt.id
                  WHERE t.assigned_to = :user_id
                  ORDER BY t.due_date ASC, t.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get overdue tasks
    public function getOverdue()
    {
        $query = "SELECT t.*, c.name as company_name, u.name as assigned_to_name,
                         s.session_date, q.question_text
                  FROM {$this->table} t
                  LEFT JOIN companies c ON t.company_id = c.id
                  LEFT JOIN users u ON t.assigned_to = u.id
                  LEFT JOIN mentorship_sessions s ON t.session_id = s.id
                  LEFT JOIN mentorship_questions q ON t.question_id = q.id
                  WHERE t.due_date < CURDATE() AND t.status != 'done'
                  ORDER BY t.due_date ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get task statistics
    public function getStatistics($companyId = null, $userId = null)
    {
        $conditions = [];
        $params = [];

        if ($companyId) {
            $conditions[] = "t.company_id = :company_id";
            $params[':company_id'] = $companyId;
        }

        if ($userId) {
            $conditions[] = "t.assigned_to = :user_id";
            $params[':user_id'] = $userId;
        }

        $whereClause = !empty($conditions) ? "WHERE " . implode(" AND ", $conditions) : "";

        $query = "SELECT
                    COUNT(*) as total_tasks,
                    SUM(CASE WHEN t.status = 'pending' THEN 1 ELSE 0 END) as pending_tasks,
                    SUM(CASE WHEN t.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_tasks,
                    SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as completed_tasks,
                    SUM(CASE WHEN t.due_date < CURDATE() AND t.status != 'done' THEN 1 ELSE 0 END) as overdue_tasks,
                    COUNT(DISTINCT t.company_id) as unique_companies
                  FROM {$this->table} t
                  {$whereClause}";

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create task from question trigger
    public function createFromTrigger($sessionId, $questionId, $companyId, $responseData = null)
    {
        // Get question details
        $query = "SELECT * FROM mentorship_questions WHERE id = :question_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':question_id', $questionId, PDO::PARAM_INT);
        $stmt->execute();
        $question = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$question || !$question['trigger_task']) {
            return ['success' => false, 'message' => 'Question does not trigger tasks'];
        }

        // Generate task title and description based on question
        $taskTitle = "Follow-up: " . substr($question['question_text'], 0, 50) . "...";
        $taskDescription = "This task was automatically created based on the response to: " . $question['question_text'];

        if ($responseData) {
            $taskDescription .= "\n\nResponse: " . $responseData;
        }

        $taskData = [
            'session_id' => $sessionId,
            'question_id' => $questionId,
            'company_id' => $companyId,
            'task_title' => $taskTitle,
            'task_description' => $taskDescription,
            'status' => 'pending',
            'due_date' => date('Y-m-d', strtotime('+7 days')) // Default to 7 days from now
        ];

        return $this->create($taskData);
    }
}
?>
