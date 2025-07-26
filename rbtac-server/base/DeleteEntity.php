
<?php
class DeleteEntity extends BaseEntity {
    public function execute($entity, $id) {
        if (!$this->validateTable($entity)) {
            return ["error" => "Invalid entity"];
        }

        $query = "DELETE FROM `$entity` WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        if ($stmt->execute([$id])) {
            return ["success" => true];
        }
        return ["error" => "Delete failed"];
    }
}
