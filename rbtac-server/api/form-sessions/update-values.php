<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';
include_once '../../models/FormTemplate.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id']) || !isset($data['values'])) {
    echo json_encode([
        "success" => false,
        "message" => "Session ID and values are required."
    ]);
    exit;
}

$syncAnswers = $data['sync_answers'] ?? true; // Default to sync

try {
    $connection = new Database();
    $db = $connection->connect();
    $sessionService = new FormSession($db);

    if ($syncAnswers) {
        // Get template structure for sync
        $templateService = new FormTemplate($db);
        $session = $sessionService->getFormSessionById($data['id']);

        if (!$session) {
            echo json_encode([
                "success" => false,
                "message" => "Session not found."
            ]);
            exit;
        }

        $template = $templateService->getFormTemplateById($session['form_template_id']);
        if (!$template) {
            echo json_encode([
                "success" => false,
                "message" => "Template not found."
            ]);
            exit;
        }

        // Update values with sync
        $sessionService->updateSessionValuesWithSync(
            $data['id'],
            $data['values'],
            $template['structure'],
            $data['updated_by'] ?? null
        );

        echo json_encode([
            "success" => true,
            "message" => "Session values updated and answers synced"
        ]);
    } else {
        // Update values only (no sync)
        $sessionService->updateSessionValues($data['id'], $data['values'], $data['updated_by'] ?? null);
        echo json_encode([
            "success" => true,
            "message" => "Session values updated"
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
