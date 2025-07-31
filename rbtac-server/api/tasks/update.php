<?php
include_once '../../config/Database.php';
include_once '../../models/Task.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id'])) {
    echo json_encode(["message" => "Task ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new Task($db);

    $service->updateTask((object) $data);
    echo json_encode(["message" => "Task updated"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
