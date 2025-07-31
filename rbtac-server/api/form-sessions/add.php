<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['form_template_id']) || empty($data['company_id']) || empty($data['user_id'])) {
    echo json_encode(["message" => "Form template ID, company ID, and user ID are required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormSession($db);

    $response = $service->addFormSession((object) $data);

    echo json_encode(["message" => "Form session created", "id" => $response]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
