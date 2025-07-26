<?php
class CollectionDataMutation
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Add a new data entry
    public function add($collectionId, $data)
    {
        $data = $this->sanitizeDataBeforeSave($data);
        $query = "INSERT INTO collection_data (collection_id, data) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$collectionId, json_encode($data)]);
        return $stmt->rowCount() ?
            $this->getById($this->conn->lastInsertId())
            : false;
    }

    // Update a data entry
    public function update($id, $data)
    {
        $data = $this->sanitizeDataBeforeSave($data);
        $query = "UPDATE collection_data SET data = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([json_encode($data), $id]);
        return $this->getById($id);
    }
    public function getById($id)
    {
        $query = "SELECT * FROM collection_data WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($item) {
            $item['data'] = json_decode($item['data']);
        }
        return $item;
    }
    // Update multiple records
    public function updateMany($ids, $data)
    {
        $data = $this->sanitizeDataBeforeSave($data);
        $query = "UPDATE collection_data SET data = ? WHERE id IN (" . implode(',', array_fill(0, count($ids), '?')) . ")";
        $stmt = $this->conn->prepare($query);
        $stmt->execute(array_merge([json_encode($data)], $ids));
        return $stmt->rowCount();
    }

    // Delete a data entry by ID
    public function remove($id)
    {
        $query = "DELETE FROM collection_data WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }

    // Delete all data entries for a specific collection
    public function removeByCollectionId($collectionId)
    {
        $query = "DELETE FROM collection_data WHERE collection_id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$collectionId]);
    }

    // ------------------------------------------
    // Private helper: clean expanded data fields
    // ------------------------------------------
    private function sanitizeDataBeforeSave(object $data): object
    {
        foreach ($data as $key => $value) {
            if (strpos($key, '_') === 0) {
                unset($data->$key);
            }
        }
        return $data;
    }
}
?>