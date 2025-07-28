<?php
// api/companies/list.dynamic.php
include_once '../../config/Database.php';
include_once '../../models/Company.php';

$data = json_decode(file_get_contents("php://input"), true);
$filters = $data['filters'] ?? [];

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new Company($db);

    $response = $service->getWithJoinsAndFilters($filters);

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
