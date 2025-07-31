<?php
include_once '../../config/Database.php';
include_once '../../models/FormTemplate.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['title']) || empty($data['structure'])) {
    echo json_encode(["message" => "Title and structure are required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormTemplate($db);

    $response = $service->addFormTemplate((object) $data);

    echo json_encode(["message" => "Form template created", "id" => $response]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
