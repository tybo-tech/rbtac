<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../config/Database.php';
include_once '../../../models/MentorshipResponse.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($_GET['session_id'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid data or missing session ID']);
    exit;
}

$sessionId = intval($_GET['session_id']);

try {
    $database = new Database();
    $db = $database->connect();
    $response = new MentorshipResponse($db);

    $result = $response->saveMultiple($sessionId, $data);

    if ($result['success']) {
        http_response_code(200);
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
