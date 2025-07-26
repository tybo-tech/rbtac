<?php
class GetEntity extends BaseEntity {
    public function execute($entity, $id) {
        if (!$this->validateTable($entity)) {
            return ["error" => "Invalid entity"];
        }

        $query = "SELECT * FROM `$entity` WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ?: ["error" => "Entity not found"];
    }
}
