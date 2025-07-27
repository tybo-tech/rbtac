<?php
// api/companies/delete.php
include_once '../../config/Database.php';
include_once '../../models/Company.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode(["message" => "Company ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new Company($db);

    $success = $service->remove($data->id);

    echo json_encode(["success" => $success]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
