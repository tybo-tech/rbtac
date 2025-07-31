<?php
include_once '../../config/Database.php';
include_once '../../models/FormTemplate.php';

$statusId = $_GET['status_id'] ?? null;

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormTemplate($db);

    $templates = $service->list($statusId);

    echo json_encode($templates);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
