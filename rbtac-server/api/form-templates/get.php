<?php
include_once '../../config/Database.php';
include_once '../../models/FormTemplate.php';

$templateId = $_GET['id'] ?? null;

if (!$templateId) {
    echo json_encode([
        "success" => false,
        "message" => "Template ID is required."
    ]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormTemplate($db);

    $template = $service->getFormTemplateById($templateId);

    if ($template) {
        echo json_encode([
            "success" => true,
            "data" => $template,
            "message" => "Template retrieved successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Template not found"
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
