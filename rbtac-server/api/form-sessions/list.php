<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';

$companyId = $_GET['company_id'] ?? null;
$templateId = $_GET['template_id'] ?? null;
$userId = $_GET['user_id'] ?? null;

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormSession($db);

    $sessions = $service->list($companyId, $templateId, $userId);

    echo json_encode($sessions);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
