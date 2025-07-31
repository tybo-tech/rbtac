<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';
include_once '../../models/FormTemplate.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['form_template_id']) || empty($data['company_id']) || empty($data['user_id'])) {
    echo json_encode(["message" => "Form template ID, company ID, and user ID are required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();

    $sessionService = new FormSession($db);
    $templateService = new FormTemplate($db);

    // Get template structure for answer sync
    $template = $templateService->getFormTemplateById($data['form_template_id']);
    if (!$template) {
        echo json_encode(["message" => "Template not found."]);
        exit;
    }

    // Add template structure to the session data for sync
    $sessionData = (object) $data;
    $sessionData->template_structure = $template['structure'];

    // Determine if this is update or create
    if (!empty($data['id'])) {
        // Update existing session
        $sessionService->updateFormSession($sessionData, true); // true = sync answers
        echo json_encode(["message" => "Session updated and answers synced", "id" => $data['id']]);
    } else {
        // Create new session
        $sessionId = $sessionService->addFormSession($sessionData, true); // true = sync answers
        echo json_encode(["message" => "Session created and answers synced", "id" => $sessionId]);
    }

} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
