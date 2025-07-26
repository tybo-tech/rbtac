<?php
class CollectionData
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all data entries for a specific collection
    public function getByCollectionId($collectionId)
    {
        $query = "SELECT * FROM collection_data WHERE collection_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$collectionId]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $items ?
            array_map(function ($item) {
                $item['data'] = json_decode($item['data'], true); // Parse data from JSON
                return $item;
            }, $items)
            : [];
    }

    // Get a data entry by ID
    public function getById($id)
    {
        $query = "SELECT * FROM collection_data WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($item) {
            $item['data'] = json_decode($item['data'], true); // Parse data from JSON
        }
        return $item;
    }

    // Add a new data entry
    public function add($collectionId, $data)
    {
        $query = "INSERT INTO collection_data (collection_id, data) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$collectionId, json_encode($data)]);
        return $stmt->rowCount() ? $this->getById($this->conn->lastInsertId()) : false;
    }

    // Update a data entry
    public function update($id, $data)
    {
        $query = "UPDATE collection_data SET data = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([json_encode($data), $id]);
        return $stmt->rowCount() ? $this->getById($id) : false;
    }

    // update many records
    public function updateMany($ids, $data)
    {
        $query = "UPDATE collection_data SET data = ? WHERE id IN (" . implode(',', array_fill(0, count($ids), '?')) . ")";
        $stmt = $this->conn->prepare($query);
        $stmt->execute(array_merge([json_encode($data)], $ids));
        return $stmt->rowCount() ? $this->getByCollectionId($ids[0]) : false;
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
}
?>