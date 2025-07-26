<?php

class ReferenceFinder
{
  private $pdo;

  public function __construct(PDO $pdo)
  {
    $this->pdo = $pdo;
  }

  public function getReferenceOptions(array $refs): array
  {
    $result = [];

    foreach ($refs as $ref) {
      $columnId = $ref->column_id ?? null;
      $collectionId = intval($ref->referenceCollectionId ?? 0);

      if (!$columnId || !$collectionId) continue;

      // Step 1: Fetch the collection row directly
      $collection = $this->getCollectionRow($collectionId);
      if (!$collection) continue;

      // Step 2: Parse columns JSON and find primary
      $columns = json_decode($collection['columns'] ?? '[]', true);
      if (!is_array($columns)) continue;

      $primaryColId = $this->findPrimaryColumnId($columns);
      if (!$primaryColId) continue;

      // Step 3: Fetch rows from collection_data
      $rows = $this->getCollectionData($collectionId);

      // Step 4: Format minimal dropdown options
      $options = [];
      foreach ($rows as $row) {
        $data = json_decode($row['data'] ?? '{}', true);
        $label = $data[$primaryColId] ?? 'Untitled';
        $options[] = [
          'id' => $row['id'],
          'name' => $label,
        ];
      }

      $result[$columnId] = $options;
    }

    return $result;
  }

  private function getCollectionRow(int $id): ?array
  {
    $stmt = $this->pdo->prepare("SELECT * FROM collections WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
  }

  private function getCollectionData(int $collectionId): array
  {
    $stmt = $this->pdo->prepare("SELECT id, data FROM collection_data WHERE collection_id = ?");
    $stmt->execute([$collectionId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
  }

  private function findPrimaryColumnId(array $columns): ?string
  {
    foreach ($columns as $col) {
      if (!empty($col['isPrimary'])) {
        return $col['id'];
      }
    }

    // Fallback: first column if exists
    return $columns[0]['id'] ?? null;
  }
}
