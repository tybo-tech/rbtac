<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';

$sessionId = $_GET['id'] ?? null;

if (!$sessionId) {
    echo json_encode(["message" => "Session ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormSession($db);

    $service->deleteFormSession($sessionId);
    echo json_encode(["message" => "Form session deleted"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
