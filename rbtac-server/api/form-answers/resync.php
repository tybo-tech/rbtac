<?php
include_once '../../config/Database.php';
include_once '../../models/FormAnswerSync.php';

$data = json_decode(file_get_contents("php://input"), true);

$sessionId = $data['session_id'] ?? $_GET['session_id'] ?? null;
$templateId = $data['template_id'] ?? $_GET['template_id'] ?? null;

if (!$sessionId && !$templateId) {
    echo json_encode(["message" => "Either session_id or template_id is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $sync = new FormAnswerSync($db);

    if ($sessionId) {
        // Resync single session
        include_once '../../models/FormSession.php';
        include_once '../../models/FormTemplate.php';

        $sessionService = new FormSession($db);
        $templateService = new FormTemplate($db);

        $session = $sessionService->getFormSessionById($sessionId);
        if (!$session) {
            echo json_encode(["message" => "Session not found."]);
            exit;
        }

        $template = $templateService->getFormTemplateById($session['form_template_id']);
        if (!$template) {
            echo json_encode(["message" => "Template not found."]);
            exit;
        }

        $sync->syncSessionAnswers(
            $sessionId,
            $session['form_template_id'],
            $session['values'],
            $template['structure']
        );

        echo json_encode(["message" => "Session answers resynced", "session_id" => $sessionId]);

    } else {
        // Resync all sessions for template
        $count = $sync->resyncTemplate($templateId);
        echo json_encode(["message" => "Template answers resynced", "template_id" => $templateId, "sessions_processed" => $count]);
    }

} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
