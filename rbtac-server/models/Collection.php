<?php
class Collection
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all collections for a specific website
    public function getByWebsiteId($websiteId)
    {
        $query = "SELECT * FROM collections WHERE website_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$websiteId]);
        $collections = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(function ($collection) {
            $collection['columns'] = json_decode($collection['columns'], true);
            $collection['metadata'] = !empty($collection['metadata']) ? json_decode($collection['metadata'], true) : null;
            return $collection;
        }, $collections);
    }

    // Get a collection by ID
    public function getById($id)
    {
        $query = "SELECT * FROM collections WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        $collection = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($collection) {
            $collection['columns'] = json_decode($collection['columns'], true);
            $collection['metadata'] = !empty($collection['metadata']) ? json_decode($collection['metadata'], true) : null;
        }
        return $collection;
    }

    // Add a new collection
    public function add($websiteId, $name, $columns, $metadata = null)
    {
        $query = "INSERT INTO collections (website_id, name, columns, metadata) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            $websiteId,
            $name,
            json_encode($columns),
            $metadata ? json_encode($metadata) : null
        ]);
        return $stmt->rowCount() ? $this->getById($this->conn->lastInsertId()) : false;
    }

    // Update a collection
    public function update($id, $name, $columns, $metadata = null)
    {
        $query = "UPDATE collections SET name = ?, columns = ?, metadata = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            $name,
            json_encode($columns),
            $metadata ? json_encode($metadata) : null,
            $id
        ]);
        return $stmt->rowCount() ? $this->getById($id) : false;
    }

    // Delete a collection
    public function remove($id)
    {
        $query = "DELETE FROM collections WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
?>
