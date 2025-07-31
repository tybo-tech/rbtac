<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';

$sessionId = $_GET['id'] ?? null;
$withTemplate = $_GET['with_template'] ?? false;

if (!$sessionId) {
    echo json_encode(["message" => "Session ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormSession($db);

    if ($withTemplate) {
        $session = $service->getSessionWithTemplate($sessionId);
    } else {
        $session = $service->getFormSessionById($sessionId);
    }

    if ($session) {
        echo json_encode($session);
    } else {
        echo json_encode(["message" => "Session not found"]);
    }
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
