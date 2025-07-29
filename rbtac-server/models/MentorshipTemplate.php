<?php
class MentorshipTemplate
{
    private $conn;
    private $table = 'mentorship_templates';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all templates
    public function getAll()
    {
        $query = "SELECT * FROM {$this->table} ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get template by ID
    public function getById($id)
    {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get template with categories and questions
    public function getWithDetails($id)
    {
        // Get template
        $template = $this->getById($id);
        if (!$template) {
            return null;
        }

        // Get categories
        $query = "SELECT * FROM mentorship_categories WHERE template_id = :template_id ORDER BY sort_order, id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':template_id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get questions
        $query = "SELECT * FROM mentorship_questions WHERE template_id = :template_id ORDER BY sort_order, id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':template_id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Parse JSON fields for questions
        foreach ($questions as &$question) {
            if ($question['options']) {
                $question['options'] = json_decode($question['options'], true);
            }
            if ($question['calculation']) {
                $question['calculation'] = json_decode($question['calculation'], true);
            }
        }

        $template['categories'] = $categories;
        $template['questions'] = $questions;

        return $template;
    }

    // Create new template
    public function create($data)
    {
        // Validate required fields
        if (empty($data['title'])) {
            return ['success' => false, 'message' => 'Title is required'];
        }

        $query = "INSERT INTO {$this->table} (title, description, category) VALUES (:title, :description, :category)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':category', $data['category']);

        if ($stmt->execute()) {
            $id = $this->conn->lastInsertId();
            return [
                'success' => true,
                'message' => 'Template created successfully',
                'id' => $id,
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to create template'];
    }

    // Update template
    public function update($id, $data)
    {
        // Validate required fields
        if (empty($data['title'])) {
            return ['success' => false, 'message' => 'Title is required'];
        }

        $query = "UPDATE {$this->table} SET title = :title, description = :description, category = :category WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':category', $data['category']);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Template updated successfully',
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to update template'];
    }

    // Get templates by category
    public function getByCategory($category)
    {
        $query = "SELECT * FROM {$this->table} WHERE category = :category ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':category', $category);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Search templates
    public function search($searchTerm)
    {
        $query = "SELECT * FROM {$this->table} WHERE title LIKE :search OR description LIKE :search ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $searchTerm = "%{$searchTerm}%";
        $stmt->bindParam(':search', $searchTerm);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
