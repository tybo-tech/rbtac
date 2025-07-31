<?php
include_once '../../config/Database.php';
include_once '../../models/FormAnswer.php';

$templateId = $_GET['template_id'] ?? null;
$groupKey = $_GET['group_key'] ?? null;
$fieldKey = $_GET['field_key'] ?? null;
$type = $_GET['type'] ?? 'frequency'; // 'frequency' or 'stats'

if (!$templateId || !$groupKey || !$fieldKey) {
    echo json_encode(["message" => "Template ID, group key, and field key are required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormAnswer($db);

    if ($type === 'stats') {
        $analytics = $service->getNumericFieldStats($templateId, $groupKey, $fieldKey);
    } else {
        $analytics = $service->getFieldValueAnalytics($templateId, $groupKey, $fieldKey);
    }

    echo json_encode($analytics);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
