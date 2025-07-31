<?php
include_once '../../config/Database.php';
include_once '../../models/FormTemplate.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id'])) {
    echo json_encode(["message" => "Template ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormTemplate($db);

    $service->updateFormTemplate((object) $data);
    echo json_encode(["message" => "Form template updated"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
