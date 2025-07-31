<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';
include_once '../../models/FormTemplate.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id']) || !isset($data['values'])) {
    echo json_encode([
        "success" => false,
        "message" => "Session ID and values are required."
    ]);
    exit;
}

$syncAnswers = $data['sync_answers'] ?? true; // Default to sync

try {
    $connection = new Database();
    $db = $connection->connect();
    $sessionService = new FormSession($db);

    if ($syncAnswers) {
        // For now, just update values - full sync implementation coming soon
        $sessionService->updateSessionValues($data['id'], $data['values'], $data['updated_by'] ?? null);

        echo json_encode([
            "success" => true,
            "message" => "Session values updated (sync feature temporarily disabled)"
        ]);
    } else {
        // Update values only (no sync)
        $sessionService->updateSessionValues($data['id'], $data['values'], $data['updated_by'] ?? null);
        echo json_encode([
            "success" => true,
            "message" => "Session values updated"
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
