<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id']) || !isset($data['values'])) {
    echo json_encode(["message" => "Session ID and values are required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormSession($db);

    $service->updateSessionValues($data['id'], $data['values'], $data['updated_by'] ?? null);
    echo json_encode(["message" => "Session values updated"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
