<?php
class ListEntity extends BaseEntity
{
    public function execute(
        $entity,
        $filters = [],
        $search = null,
        $orderBy = "created_at",
        $direction = "DESC",
        $page = 1,
        $limit = 30
    ) {
        if (!$this->validateTable($entity)) {
            return ["error" => "Invalid entity"];
        }

        $limit = min(max((int) $limit, 1), 100);
        $offset = ($page - 1) * $limit;

        $query = "SELECT * FROM `$entity`";
        $params = [];
        $conditions = [];

        if (!empty($filters)) {
            foreach ($filters as $key => $value) {
                $conditions[] = "`$key` = ?";
                $params[] = $value;
            }
        }

        if (!empty($search) && isset($search['columns']) && isset($search['query'])) {
            $searchConditions = [];
            $searchQuery = "%" . $search['query'] . "%";
            foreach ($search['columns'] as $column) {
                $searchConditions[] = "`$column` LIKE ?";
                $params[] = $searchQuery;
            }
            $conditions[] = "(" . implode(" OR ", $searchConditions) . ")";
        }

        if (!empty($conditions)) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }

        if ($orderBy) {
            $query .= " ORDER BY `$orderBy`  $direction";
        }

        // Directly embedding integer values
        $query .= " LIMIT " . (int) $limit . " OFFSET " . (int) $offset;

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "data" => $data,
            "pagination" => [
                "page" => $page,
                "limit" => $limit,
                "total_pages" => ceil(count($data) / $limit)
            ]
        ];
    }
}
?>