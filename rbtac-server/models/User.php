<?php
class User
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all users
    public function getAll()
    {
        $query = "SELECT * FROM users";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get user by ID
    public function getById($id)
    {
        $query = "SELECT * FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get user by email + password (LOGIN)
    public function login($email, $password)
    {
        $query = "SELECT * FROM users WHERE email = ? AND password = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$email, $password]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get users by company_id
    public function getByCompanyId($companyId)
    {
        $query = "SELECT * FROM users WHERE company_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$companyId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Add a new user
    public function add($data)
    {
        $query = "INSERT INTO users (
            name, gender, race, email, cell, dob, id_number, password, company_id, is_primary,
            created_by, updated_by, status_id
        ) VALUES (
            :name, :gender, :race, :email, :cell, :dob, :id_number, :password, :company_id, :is_primary,
            :created_by, :updated_by, :status_id
        )";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([
            'name' => $data['name'],
            'gender' => $data['gender'] ?? null,
            'race' => $data['race'] ?? null,
            'email' => $data['email'] ?? null,
            'cell' => $data['cell'] ?? null,
            'dob' => $data['dob'] ?? null,
            'id_number' => $data['id_number'] ?? null,
            'password' => $data['password'] ?? null,
            'company_id' => $data['company_id'] ?? null,
            'is_primary' => $data['is_primary'] ?? 0,
            'created_by' => $data['created_by'] ?? null,
            'updated_by' => $data['updated_by'] ?? null,
            'status_id' => $data['status_id'] ?? 1
        ]);
        return $success ? $this->getById($this->conn->lastInsertId()) : false;
    }

    // Update a user
    public function update($id, $data)
    {
        $query = "UPDATE users SET
            name = :name,
            gender = :gender,
            race = :race,
            email = :email,
            cell = :cell,
            dob = :dob,
            id_number = :id_number,
            password = :password,
            company_id = :company_id,
            is_primary = :is_primary,
            updated_by = :updated_by,
            status_id = :status_id
        WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([
            'id' => $id,
            'name' => $data['name'],
            'gender' => $data['gender'] ?? null,
            'race' => $data['race'] ?? null,
            'email' => $data['email'] ?? null,
            'cell' => $data['cell'] ?? null,
            'dob' => $data['dob'] ?? null,
            'id_number' => $data['id_number'] ?? null,
            'password' => $data['password'] ?? null,
            'company_id' => $data['company_id'] ?? null,
            'is_primary' => $data['is_primary'] ?? 0,
            'updated_by' => $data['updated_by'] ?? null,
            'status_id' => $data['status_id'] ?? 1
        ]);
        return $success ? $this->getById($id) : false;
    }

    // Delete a user
    public function remove($id)
    {
        $query = "DELETE FROM users WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
?>
