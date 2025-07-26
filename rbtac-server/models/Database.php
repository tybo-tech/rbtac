<?php
class QueryExecutor
{
    public $_conn;

    public function __construct($conn)
    {
        $this->_conn = $conn;
    }

    public function executeQuery($query, $params = [])
    {

        try {
            $stmt = $this->_conn->prepare($query);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            echo 'Error: ' . $e->getMessage();
            return null;
        }
    }
}
