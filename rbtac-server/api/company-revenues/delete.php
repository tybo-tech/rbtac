<?php
// api/company-revenues/delete.php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyRevenue.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new CompanyRevenue($db);

    // Get the input data
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? $_GET['id'] ?? null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "ID parameter is required"]);
        exit;
    }

    // Check if record exists
    $existing = $service->getById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(["message" => "Company revenue record not found"]);
        exit;
    }

    $success = $service->remove($id);

    if ($success) {
        echo json_encode(["message" => "Company revenue record deleted successfully"]);
    } else {
        http_response_code(500);
        echo json_encode(["message" => "Failed to delete company revenue record"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
