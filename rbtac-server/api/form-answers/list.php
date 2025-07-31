<?php
include_once '../../config/Database.php';
include_once '../../models/FormAnswer.php';

$sessionId = $_GET['session_id'] ?? null;
$templateId = $_GET['template_id'] ?? null;
$groupKey = $_GET['group_key'] ?? null;
$fieldKey = $_GET['field_key'] ?? null;

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormAnswer($db);

    $answers = null;

    if ($sessionId) {
        $answers = $service->getAnswersBySession($sessionId);
    } elseif ($templateId && $groupKey && $fieldKey) {
        $answers = $service->getAnswersByField($templateId, $groupKey, $fieldKey);
    } elseif ($templateId) {
        $answers = $service->getAnswersByTemplate($templateId);
    } else {
        echo json_encode(["message" => "Session ID or Template ID is required."]);
        exit;
    }

    echo json_encode($answers);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
