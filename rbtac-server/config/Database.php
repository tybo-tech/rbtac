<?php
include_once 'headers.php';

class Database
{
    private $host = 'mysql'; // Matches service name from docker-compose.yml
    private $db_name = 'docker'; // Matches MYSQL_DATABASE in docker-compose.yml rbttaces_betta
    private $username = 'docker'; // Matches MYSQL_USER rbttaces_betta
    private $password = 'docker'; // Matches MYSQL_PASSWORD Harder11!)0

    // private $db_name = 'rbttaces_betta'; // Matches MYSQL_DATABASE in docker-compose.yml rbttaces_betta
    // private $username = 'rbttaces_betta'; // Matches MYSQL_DATABASE in docker-compose.yml rbttaces_betta
    // private $password = 'Harder11!)0';
    // private $host = 'localhost'; // Matches service name from docker-compose.yml
    private $conn;

    public function connect()
    {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name};charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die(json_encode(["error" => $e->getMessage()]));
        }
        return $this->conn;
    }

    public function getGuid($conn)
    {
        $stmt = $conn->prepare("SELECT UUID() as ID");
        $stmt->execute();

        if ($stmt->rowCount()) {
            $uuid = $stmt->fetch(PDO::FETCH_ASSOC);
            return $uuid['ID'];
        }
        return null;
    }
}
?>