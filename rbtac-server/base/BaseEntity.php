<?php
class BaseEntity
{
    protected $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Validate entity (table) to prevent SQL injection
    protected function validateTable($table)
    {
        $allowedTables = [
            'companies',
            'company_progress',
            'EntityFieldConfig',
            'categories',
            'users'
        ]; // Add all valid tables
        return in_array($table, $allowedTables);
    }

    // Sanitize input data
    protected function sanitizeData($data)
    {
        foreach ($data as $key => $value) {
            $data[$key] = htmlspecialchars(strip_tags($value));
        }
        return $data;
    }
}
