<?php
include_once '../../config/Database.php';
include_once '../../models/FormTemplate.php';

$templateId = $_GET['id'] ?? null;

if (!$templateId) {
    echo json_encode(["message" => "Template ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormTemplate($db);

    $template = $service->getFormTemplateById($templateId);

    if ($template) {
        echo json_encode($template);
    } else {
        echo json_encode(["message" => "Template not found"]);
    }
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
