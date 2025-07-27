<?php
class Reason
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all reasons
    public function getAll()
    {
        $query = "SELECT * FROM reasons";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get reason by ID
    public function getById($id)
    {
        $query = "SELECT * FROM reasons WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Add a new reason
    public function add($data)
    {
        $query = "INSERT INTO reasons (reason, created_by, updated_by, status_id)
                  VALUES (:reason, :created_by, :updated_by, :status_id)";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([
            'reason' => $data['reason'],
            'created_by' => $data['created_by'] ?? null,
            'updated_by' => $data['updated_by'] ?? null,
            'status_id' => $data['status_id'] ?? 1
        ]);
        return $success ? $this->getById($this->conn->lastInsertId()) : false;
    }

    // Update a reason
    public function update($id, $data)
    {
        $query = "UPDATE reasons SET
                    reason = :reason,
                    updated_by = :updated_by,
                    status_id = :status_id
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $data['id'] = $id;
        $success = $stmt->execute([
            'id' => $id,
            'reason' => $data['reason'],
            'updated_by' => $data['updated_by'] ?? null,
            'status_id' => $data['status_id'] ?? 1
        ]);
        return $success ? $this->getById($id) : false;
    }

    // Delete a reason
    public function remove($id)
    {
        $query = "DELETE FROM reasons WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
?>
