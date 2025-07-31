<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';

$sessionId = $_GET['id'] ?? null;
$withAnswers = $_GET['with_answers'] ?? 'true'; // Default to safe deletion

if (!$sessionId) {
    echo json_encode(["message" => "Session ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormSession($db);

    if ($withAnswers === 'true') {
        // Safe deletion - explicitly removes answers first
        $service->deleteFormSessionWithAnswers($sessionId);
        echo json_encode(["message" => "Form session and answers deleted"]);
    } else {
        // Standard deletion - relies on CASCADE
        $service->deleteFormSession($sessionId);
        echo json_encode(["message" => "Form session deleted"]);
    }
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
