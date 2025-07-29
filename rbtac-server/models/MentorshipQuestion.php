<?php
include_once 'MentorshipCategory.php';

class MentorshipQuestion
{
    private $conn;
    private $table = 'mentorship_questions';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all questions for a template
    public function getByTemplateId($templateId)
    {
        $query = "SELECT * FROM {$this->table} WHERE template_id = :template_id ORDER BY sort_order, id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':template_id', $templateId, PDO::PARAM_INT);
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Parse JSON fields
        foreach ($questions as &$question) {
            if ($question['options']) {
                $question['options'] = json_decode($question['options'], true);
            }
            if ($question['calculation']) {
                $question['calculation'] = json_decode($question['calculation'], true);
            }
        }

        return $questions;
    }

    // Get questions by category
    public function getByCategoryId($categoryId)
    {
        $query = "SELECT * FROM {$this->table} WHERE category_id = :category_id ORDER BY sort_order, id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category_id', $categoryId, PDO::PARAM_INT);
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Parse JSON fields
        foreach ($questions as &$question) {
            if ($question['options']) {
                $question['options'] = json_decode($question['options'], true);
            }
            if ($question['calculation']) {
                $question['calculation'] = json_decode($question['calculation'], true);
            }
        }

        return $questions;
    }

    // Get question by ID
    public function getById($id)
    {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $question = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($question) {
            // Parse JSON fields
            if ($question['options']) {
                $question['options'] = json_decode($question['options'], true);
            }
            if ($question['calculation']) {
                $question['calculation'] = json_decode($question['calculation'], true);
            }
        }

        return $question;
    }

    // Create new question
    public function create($data)
    {
        // Validate required fields
        if (empty($data['template_id']) || empty($data['question_text']) || empty($data['question_type'])) {
            return ['success' => false, 'message' => 'Template ID, question text, and question type are required'];
        }

        // Validate question type
        $validTypes = ['text', 'textarea', 'number', 'boolean', 'dropdown', 'date'];
        if (!in_array($data['question_type'], $validTypes)) {
            return ['success' => false, 'message' => 'Invalid question type'];
        }

        // Validate category exists if provided
        if (!empty($data['category_id'])) {
            $categoryModel = new MentorshipCategory($this->conn);
            $category = $categoryModel->getById($data['category_id']);
            if (!$category || $category['template_id'] != $data['template_id']) {
                return ['success' => false, 'message' => 'Invalid category'];
            }
        }

        // Prepare JSON fields
        $options = null;
        $calculation = null;

        if (!empty($data['options'])) {
            $options = is_string($data['options']) ? $data['options'] : json_encode($data['options']);
        }

        if (!empty($data['calculation'])) {
            $calculation = is_string($data['calculation']) ? $data['calculation'] : json_encode($data['calculation']);
        }

        $query = "INSERT INTO {$this->table} (template_id, category_id, question_text, question_type, is_required, options, calculation, trigger_task, sort_order)
                  VALUES (:template_id, :category_id, :question_text, :question_type, :is_required, :options, :calculation, :trigger_task, :sort_order)";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':template_id', $data['template_id'], PDO::PARAM_INT);
        $stmt->bindParam(':category_id', $data['category_id'], PDO::PARAM_INT);
        $stmt->bindParam(':question_text', $data['question_text']);
        $stmt->bindParam(':question_type', $data['question_type']);
        $stmt->bindParam(':is_required', $data['is_required'], PDO::PARAM_BOOL);
        $stmt->bindParam(':options', $options);
        $stmt->bindParam(':calculation', $calculation);
        $stmt->bindParam(':trigger_task', $data['trigger_task'], PDO::PARAM_BOOL);
        $stmt->bindParam(':sort_order', $data['sort_order'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            $id = $this->conn->lastInsertId();
            return [
                'success' => true,
                'message' => 'Question created successfully',
                'id' => $id,
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to create question'];
    }

    // Update question
    public function update($id, $data)
    {
        // Validate required fields
        if (empty($data['question_text']) || empty($data['question_type'])) {
            return ['success' => false, 'message' => 'Question text and question type are required'];
        }

        // Validate question type
        $validTypes = ['text', 'textarea', 'number', 'boolean', 'dropdown', 'date'];
        if (!in_array($data['question_type'], $validTypes)) {
            return ['success' => false, 'message' => 'Invalid question type'];
        }

        // Prepare JSON fields
        $options = null;
        $calculation = null;

        if (!empty($data['options'])) {
            $options = is_string($data['options']) ? $data['options'] : json_encode($data['options']);
        }

        if (!empty($data['calculation'])) {
            $calculation = is_string($data['calculation']) ? $data['calculation'] : json_encode($data['calculation']);
        }

        $query = "UPDATE {$this->table} SET category_id = :category_id, question_text = :question_text, question_type = :question_type,
                  is_required = :is_required, options = :options, calculation = :calculation, trigger_task = :trigger_task, sort_order = :sort_order
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':category_id', $data['category_id'], PDO::PARAM_INT);
        $stmt->bindParam(':question_text', $data['question_text']);
        $stmt->bindParam(':question_type', $data['question_type']);
        $stmt->bindParam(':is_required', $data['is_required'], PDO::PARAM_BOOL);
        $stmt->bindParam(':options', $options);
        $stmt->bindParam(':calculation', $calculation);
        $stmt->bindParam(':trigger_task', $data['trigger_task'], PDO::PARAM_BOOL);
        $stmt->bindParam(':sort_order', $data['sort_order'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Question updated successfully',
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to update question'];
    }

    // Reorder questions
    public function reorder($templateId, $orderData)
    {
        try {
            $this->conn->beginTransaction();

            foreach ($orderData as $item) {
                $query = "UPDATE {$this->table} SET sort_order = :sort_order WHERE id = :id AND template_id = :template_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':id', $item['id'], PDO::PARAM_INT);
                $stmt->bindParam(':sort_order', $item['sort_order'], PDO::PARAM_INT);
                $stmt->bindParam(':template_id', $templateId, PDO::PARAM_INT);
                $stmt->execute();
            }

            $this->conn->commit();
            return ['success' => true, 'message' => 'Questions reordered successfully'];
        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'Failed to reorder questions'];
        }
    }

    // Get questions that trigger tasks
    public function getTaskTriggers($templateId)
    {
        $query = "SELECT * FROM {$this->table} WHERE template_id = :template_id AND trigger_task = 1 ORDER BY sort_order, id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':template_id', $templateId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Validate question data based on type
    public function validateQuestionData($questionType, $value)
    {
        switch ($questionType) {
            case 'number':
                return is_numeric($value);
            case 'boolean':
                return is_bool($value) || in_array($value, [0, 1, '0', '1', true, false]);
            case 'date':
                return strtotime($value) !== false;
            case 'text':
            case 'textarea':
            case 'dropdown':
            default:
                return true; // Basic validation for text types
        }
    }
}
?>
