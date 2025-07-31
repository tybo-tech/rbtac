<?php
include_once '../../config/Database.php';
include_once '../../models/Task.php';

$companyId = $_GET['company_id'] ?? null;

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new Task($db);

    $tasks = $service->list($companyId);

    echo json_encode($tasks);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
