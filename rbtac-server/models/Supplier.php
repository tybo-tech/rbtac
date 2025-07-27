<?php
class Supplier
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all suppliers
    public function getAll()
    {
        $query = "SELECT * FROM suppliers";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get supplier by ID
    public function getById($id)
    {
        $query = "SELECT * FROM suppliers WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Add a new supplier
    public function add($data)
    {
        $query = "INSERT INTO suppliers (name, created_by, updated_by, status_id)
                  VALUES (:name, :created_by, :updated_by, :status_id)";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([
            'name' => $data['name'],
            'created_by' => $data['created_by'] ?? null,
            'updated_by' => $data['updated_by'] ?? null,
            'status_id' => $data['status_id'] ?? 1
        ]);
        return $success ? $this->getById($this->conn->lastInsertId()) : false;
    }

    // Update a supplier
    public function update($id, $data)
    {
        $query = "UPDATE suppliers SET
                    name = :name,
                    updated_by = :updated_by,
                    status_id = :status_id
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'updated_by' => $data['updated_by'] ?? null,
            'status_id' => $data['status_id'] ?? 1
        ]);
        return $success ? $this->getById($id) : false;
    }

    // Delete a supplier
    public function remove($id)
    {
        $query = "DELETE FROM suppliers WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
?>
