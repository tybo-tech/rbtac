<?php
class View
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all views for a specific collection
    public function getByCollectionId($collectionId)
    {
        $query = "SELECT * FROM views WHERE collection_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$collectionId]);
        $views = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'hydrateView'], $views);
    }

    // Get a single view by ID
    public function getById($id)
    {
        $query = "SELECT * FROM views WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        $view = $stmt->fetch(PDO::FETCH_ASSOC);
        return $view ? $this->hydrateView($view) : null;
    }

    // Add a new view
    public function add($collectionId, $name, $type, $field, $config)
    {
        $query = "INSERT INTO views (collection_id, name, type, field, config) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            $collectionId,
            $name,
            $type,
            $field,
            json_encode($config)
        ]);
        return $stmt->rowCount() ? $this->getById($this->conn->lastInsertId()) : false;
    }

    // Update an existing view
    public function update($id, $name, $type, $field, $config)
    {
        $query = "UPDATE views SET name = ?, type = ?, field = ?, config = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            $name,
            $type,
            $field,
            json_encode($config),
            $id
        ]);
        return $stmt->rowCount() ? $this->getById($id) : false;
    }

    // Delete a view
    public function remove($id)
    {
        $query = "DELETE FROM views WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }

    // Decode JSON config to PHP array
    private function hydrateView($view)
    {
        $view['config'] = json_decode($view['config'], true);
        return $view;
    }
}
?>
