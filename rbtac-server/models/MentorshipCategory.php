<?php
class MentorshipCategory
{
    private $conn;
    private $table = 'mentorship_categories';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all categories for a template
    public function getByTemplateId($templateId)
    {
        $query = "SELECT * FROM {$this->table} WHERE template_id = :template_id ORDER BY sort_order, id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':template_id', $templateId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get hierarchical categories for a template
    public function getHierarchical($templateId)
    {
        $categories = $this->getByTemplateId($templateId);
        return $this->buildHierarchy($categories);
    }

    // Build hierarchy from flat array
    private function buildHierarchy($categories, $parentId = null)
    {
        $result = [];
        foreach ($categories as $category) {
            if ($category['parent_id'] == $parentId) {
                $category['children'] = $this->buildHierarchy($categories, $category['id']);
                $result[] = $category;
            }
        }
        return $result;
    }

    // Get category by ID
    public function getById($id)
    {
        $query = "SELECT * FROM {$this->table} WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create new category
    public function create($data)
    {
        // Validate required fields
        if (empty($data['template_id']) || empty($data['name'])) {
            return ['success' => false, 'message' => 'Template ID and name are required'];
        }

        // Validate parent_id exists if provided
        if (!empty($data['parent_id'])) {
            $parent = $this->getById($data['parent_id']);
            if (!$parent || $parent['template_id'] != $data['template_id']) {
                return ['success' => false, 'message' => 'Invalid parent category'];
            }
        }

        $query = "INSERT INTO {$this->table} (template_id, parent_id, name, sort_order) VALUES (:template_id, :parent_id, :name, :sort_order)";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':template_id', $data['template_id'], PDO::PARAM_INT);
        $stmt->bindParam(':parent_id', $data['parent_id'], PDO::PARAM_INT);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':sort_order', $data['sort_order'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            $id = $this->conn->lastInsertId();
            return [
                'success' => true,
                'message' => 'Category created successfully',
                'id' => $id,
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to create category'];
    }

    // Update category
    public function update($id, $data)
    {
        // Validate required fields
        if (empty($data['name'])) {
            return ['success' => false, 'message' => 'Name is required'];
        }

        // Prevent circular references
        if (!empty($data['parent_id']) && $this->wouldCreateCircularReference($id, $data['parent_id'])) {
            return ['success' => false, 'message' => 'Cannot set parent - would create circular reference'];
        }

        $query = "UPDATE {$this->table} SET parent_id = :parent_id, name = :name, sort_order = :sort_order WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':parent_id', $data['parent_id'], PDO::PARAM_INT);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':sort_order', $data['sort_order'], PDO::PARAM_INT);

        if ($stmt->execute()) {
            return [
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $this->getById($id)
            ];
        }

        return ['success' => false, 'message' => 'Failed to update category'];
    }

    // Check if setting parent would create circular reference
    private function wouldCreateCircularReference($categoryId, $parentId)
    {
        if ($categoryId == $parentId) {
            return true;
        }

        $parent = $this->getById($parentId);
        if (!$parent || !$parent['parent_id']) {
            return false;
        }

        return $this->wouldCreateCircularReference($categoryId, $parent['parent_id']);
    }

    // Get root categories for a template
    public function getRootCategories($templateId)
    {
        $query = "SELECT * FROM {$this->table} WHERE template_id = :template_id AND parent_id IS NULL ORDER BY sort_order, id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':template_id', $templateId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get child categories
    public function getChildren($parentId)
    {
        $query = "SELECT * FROM {$this->table} WHERE parent_id = :parent_id ORDER BY sort_order, id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':parent_id', $parentId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Reorder categories
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
            return ['success' => true, 'message' => 'Categories reordered successfully'];
        } catch (Exception $e) {
            $this->conn->rollBack();
            return ['success' => false, 'message' => 'Failed to reorder categories'];
        }
    }
}
?>
