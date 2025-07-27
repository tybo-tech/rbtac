<?php
// api/suppliers/update.php
include_once '../../config/Database.php';
include_once '../../models/Supplier.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id'])) {
    echo json_encode(["message" => "Supplier ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new Supplier($db);

    $response = $service->update($data['id'], $data);

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
