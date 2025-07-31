<?php
include_once '../../config/Database.php';
include_once '../../models/FormAnswer.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['form_session_id']) || empty($data['form_template_id']) ||
    empty($data['group_key']) || empty($data['field_key'])) {
    echo json_encode(["message" => "Session ID, template ID, group key, and field key are required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormAnswer($db);

    $response = $service->addFormAnswer((object) $data);

    echo json_encode(["message" => "Form answer created", "id" => $response]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
