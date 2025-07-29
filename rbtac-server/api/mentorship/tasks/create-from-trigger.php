<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../config/Database.php';
include_once '../../../models/MentorshipTask.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['session_id']) || !isset($data['question_id']) || !isset($data['company_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields: session_id, question_id, company_id']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();
    $task = new MentorshipTask($db);

    $responseData = isset($data['response_data']) ? $data['response_data'] : null;

    $result = $task->createFromTrigger(
        $data['session_id'],
        $data['question_id'],
        $data['company_id'],
        $responseData
    );

    if ($result['success']) {
        http_response_code(201);
    } else {
        http_response_code(400);
    }

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
