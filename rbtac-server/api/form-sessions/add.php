<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['form_template_id']) || empty($data['company_id']) || empty($data['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Form template ID, company ID, and user ID are required."
    ]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormSession($db);

    $sessionId = $service->addFormSession((object) $data);

    // Get the created session for return
    $createdSession = $service->getFormSessionById($sessionId);

    echo json_encode([
        "success" => true,
        "data" => $createdSession,
        "message" => "Form session created successfully",
        "id" => $sessionId
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
