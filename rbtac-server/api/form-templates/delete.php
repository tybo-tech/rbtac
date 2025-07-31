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

    $service->deleteFormTemplate($templateId);
    echo json_encode(["message" => "Form template deleted"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
