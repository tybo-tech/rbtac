<?php
include_once '../../config/Database.php';
include_once '../../models/FormSession.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['session_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Session ID is required."
    ]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormSession($db);

    // Get the session
    $session = $service->getFormSessionById($data['session_id']);
    if (!$session) {
        echo json_encode([
            "success" => false,
            "message" => "Session not found."
        ]);
        exit;
    }

    // Update session status to completed (status_id = 2, assuming 1=active, 2=completed)
    $sessionObj = (object) [
        'id' => $data['session_id'],
        'form_template_id' => $session['form_template_id'],
        'company_id' => $session['company_id'],
        'user_id' => $session['user_id'],
        'values' => $session['values'],
        'status_id' => 2, // Completed status
        'updated_by' => $data['updated_by'] ?? null
    ];

    $service->updateFormSession($sessionObj);

    echo json_encode([
        "success" => true,
        "message" => "Session submitted successfully",
        "data" => $session
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
