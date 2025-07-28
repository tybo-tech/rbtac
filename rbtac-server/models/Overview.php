<?php
include_once 'Program.php';
class Overview
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all programs
    public function get()
    {
        $query = "SELECT * FROM programs";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

}
?>
