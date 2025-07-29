<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../config/Database.php';
include_once '../../../models/MentorshipResponse.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();
    $response = new MentorshipResponse($db);

    // Check if specific ID is requested
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $result = $response->getById($id);

        if ($result) {
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Response not found']);
        }
    } elseif (isset($_GET['session_id'])) {
        $sessionId = intval($_GET['session_id']);
        $result = $response->getBySessionId($sessionId);
        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['statistics'])) {
        $sessionId = isset($_GET['session_id']) ? intval($_GET['session_id']) : null;
        $questionId = isset($_GET['question_id']) ? intval($_GET['question_id']) : null;
        $result = $response->getStatistics($sessionId, $questionId);
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Session ID is required']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
