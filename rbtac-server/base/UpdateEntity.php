<?php
class UpdateEntity extends BaseEntity {
    public function execute($entity, $data, $where) {
        if (!$this->validateTable($entity)) {
            return ["error" => "Invalid entity"];
        }

        $data = $this->sanitizeData($data);
        $updates = implode(", ", array_map(fn($key) => "`$key` = ?", array_keys($data)));
        $whereClause = implode(" AND ", array_map(fn($key) => "`$key` = ?", array_keys($where)));

        $query = "UPDATE `$entity` SET $updates WHERE $whereClause";
        $stmt = $this->conn->prepare($query);
        $params = array_merge(array_values($data), array_values($where));

        if ($stmt->execute($params)) {
            return ["success" => true];
        }
        return ["error" => "Update failed"];
    }
}
