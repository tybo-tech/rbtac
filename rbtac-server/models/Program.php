<?php
class Program
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all programs
    public function getAll()
    {
        $query = "SELECT * FROM programs";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get a program by ID
    public function getById($id)
    {
        $query = "SELECT * FROM programs WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Add a new program
    public function add($data)
    {
        $query = "INSERT INTO programs (name, description, start_date, end_date, status_id)
                  VALUES (:name, :description, :start_date, :end_date, :status_id)";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'status_id' => $data['status_id'] ?? 1,
        ]);
        return $success ? $this->getById($this->conn->lastInsertId()) : false;
    }

    // Update a program
    public function update($id, $data)
    {
        $query = "UPDATE programs SET
                    name = :name,
                    description = :description,
                    start_date = :start_date,
                    end_date = :end_date,
                    status_id = :status_id
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $data['id'] = $id;
        $success = $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'status_id' => $data['status_id'] ?? 1,
        ]);
        return $success ? $this->getById($id) : false;
    }

    // Delete a program
    public function remove($id)
    {
        $query = "DELETE FROM programs WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
?>
