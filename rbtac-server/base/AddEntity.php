<?php
class AddEntity extends BaseEntity
{
    public function execute($entity, $data)
    {
        try {
            if (!$this->validateTable($entity)) {
                return ["error" => "Invalid entity"];
            }

            $data = $this->sanitizeData($data);
            $columns = implode(", ", array_keys($data));
            $placeholders = implode(", ", array_fill(0, count($data), "?"));

            $query = "INSERT INTO `$entity` ($columns) VALUES ($placeholders)";
            // return $query;
            $stmt = $this->conn->prepare($query);

            if ($stmt->execute(array_values($data))) {
                return ["success" => true, "id" => $this->conn->lastInsertId()];
            }
            return ["error" => "Insert failed"];
        }
        catch (Exception $e) {
            return ["error" => $e->getMessage()];
        }
    }
}
