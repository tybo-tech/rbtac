<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id'])) {
    echo json_encode(["message" => "Session ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormSession($db);

    $service->updateFormSession((object) $data);
    echo json_encode(["message" => "Form session updated"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
