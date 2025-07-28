<?php


class CollectionDataQuery
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function getById($id, $deep = false)
  {
    $query = "SELECT * FROM collection_data WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->execute([$id]);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);

    return $item ? $this->expandData($item, $deep) : null;
  }

  public function getByCollectionAndParent($collectionId, $parentId, $deep = false)
  {
    $query = "SELECT * FROM collection_data WHERE collection_id = ? AND parent_id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->execute([$collectionId, $parentId]);
    return $this->mapWithExpansion($stmt->fetchAll(PDO::FETCH_ASSOC), $deep);
  }

  public function getAllByCollection($collectionId, $deep = false)
  {
    $query = "SELECT * FROM collection_data WHERE collection_id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->execute([$collectionId]);
    return $this->mapWithExpansion($stmt->fetchAll(PDO::FETCH_ASSOC), $deep);
  }

  public function getByParentId($parentId, $deep = false)
  {
    $query = "SELECT * FROM collection_data WHERE parent_id = ?";
    $stmt = $this->conn->prepare($query);
    $stmt->execute([$parentId]);
    return $this->mapWithExpansion($stmt->fetchAll(PDO::FETCH_ASSOC), $deep);
  }

  public function find(CollectionSearchModel $searchModel, $deep = false)
  {
    $conditions = ["collection_id = ?"];
    $params = [$searchModel->getCollectionId()];

    foreach ($searchModel->getFilters() as $filter) {
      $fieldPath = "JSON_UNQUOTE(JSON_EXTRACT(data, '$.{$filter->getField()}'))";
      $conditions[] = $this->buildOperatorCondition(
        $fieldPath,
        $filter->getOperator(),
        $params,
        $filter->getValue()
      );
    }

    $where = implode(' AND ', $conditions);
    $order = $searchModel->getSortBy()
      ? "ORDER BY JSON_UNQUOTE(JSON_EXTRACT(data, '$.{$searchModel->getSortBy()}')) " . strtoupper($searchModel->getSortOrder())
      : "";

    $query = "SELECT * FROM collection_data WHERE $where $order";
    $stmt = $this->conn->prepare($query);
    $stmt->execute($params);
    return $this->mapWithExpansion($stmt->fetchAll(PDO::FETCH_ASSOC), $deep);
  }

  public function findMany($collectionId, $filters = [], $limit = null, $deep = false)
  {
    $conditions = ["collection_id = ?"];
    $params = [$collectionId];

    foreach ($filters as $filter) {
      $fieldPath = "JSON_UNQUOTE(JSON_EXTRACT(data, '$.{$filter['field']}'))";
      $conditions[] = $this->buildOperatorCondition(
        $fieldPath,
        $filter['operator'],
        $params,
        $filter['value']
      );
    }

    $where = implode(' AND ', $conditions);
    $limitClause = $limit ? "LIMIT $limit" : "";

    $query = "SELECT * FROM collection_data WHERE $where ORDER BY id ASC $limitClause";
    $stmt = $this->conn->prepare($query);
    $stmt->execute($params);
    return $this->mapWithExpansion($stmt->fetchAll(PDO::FETCH_ASSOC), $deep);
  }

  // Simplified: just decode data
  private function expandData(array $item, $deep = false): array
  {
    $item['data'] = json_decode($item['data'], true);
    return $item;
  }

  private function mapWithExpansion(array $rows, bool $deep = false): array
  {
    return array_map(fn($item) => $this->expandData($item, $deep), $rows);
  }

  private function buildOperatorCondition($fieldPath, $operator, &$params, $value)
  {
    switch ($operator) {
      case 'equals':
        $params[] = $value;
        return "$fieldPath = ?";
      case 'contains':
        $params[] = '%' . $value . '%';
        return "$fieldPath LIKE ?";
      case 'greater_than':
        $params[] = $value;
        return "$fieldPath > ?";
      case 'less_than':
        $params[] = $value;
        return "$fieldPath < ?";
      case 'in':
        if (!is_array($value)) {
          throw new Exception("Operator 'in' requires an array.");
        }
        $placeholders = implode(',', array_fill(0, count($value), '?'));
        $params = array_merge($params, $value);
        return "$fieldPath IN ($placeholders)";
      default:
        throw new Exception("Unsupported operator: $operator");
    }
  }
}

class CollectionSearchModel
{
  private $collectionId;
  private $filters;
  private $sortBy;
  private $sortOrder = 'ASC'; // Default sort order

  public function __construct($data)
  {
    $this->collectionId = $data->collection_id ?? null;
    $this->filters = array_map(function ($filterData) {
      return new CollectionFilter($filterData->field, $filterData->operator, $filterData->value);
    }, $data->filters ?? []);
    $this->sortBy = $data->sortBy ?? null;
    $this->sortOrder = $data->sortOrder ?? 'ASC';
  }

  public function getCollectionId()
  {
    return $this->collectionId;
  }

  public function getFilters()
  {
    return $this->filters;
  }

  public function getSortBy()
  {
    return $this->sortBy;
  }

  public function getSortOrder()
  {
    return $this->sortOrder;
  }
}

class CollectionFilter
{
  private $field;
  private $operator;
  private $value;

  public function __construct($field, $operator, $value)
  {
    $this->field = $field;
    $this->operator = $operator;
    $this->value = $value;
  }

  public function getField()
  {
    return $this->field;
  }

  public function getOperator()
  {
    return $this->operator;
  }

  public function getValue()
  {
    return $this->value;
  }
}
