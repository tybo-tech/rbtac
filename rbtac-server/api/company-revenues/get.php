<?php
// api/company-revenues/get.php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyRevenue.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new CompanyRevenue($db);

    $id = $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "ID parameter is required"]);
        exit;
    }

    $response = $service->getById($id);

    if (!$response) {
        http_response_code(404);
        echo json_encode(["message" => "Company revenue record not found"]);
        exit;
    }

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
