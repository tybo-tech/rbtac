<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../config/Database.php';
include_once '../../../models/MentorshipTask.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();
    $task = new MentorshipTask($db);

    // Check if specific ID is requested
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $result = $task->getById($id);

        if ($result) {
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Task not found']);
        }
    } elseif (isset($_GET['session_id'])) {
        $sessionId = intval($_GET['session_id']);
        $result = $task->getBySessionId($sessionId);
        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['company_id'])) {
        $companyId = intval($_GET['company_id']);
        $result = $task->getByCompanyId($companyId);
        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['status'])) {
        $status = $_GET['status'];
        $result = $task->getByStatus($status);
        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['assigned_to'])) {
        $userId = intval($_GET['assigned_to']);
        $result = $task->getAssignedToUser($userId);
        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['overdue'])) {
        $result = $task->getOverdue();
        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['statistics'])) {
        $companyId = isset($_GET['company_id']) ? intval($_GET['company_id']) : null;
        $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
        $result = $task->getStatistics($companyId, $userId);
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        $result = $task->getAll();
        echo json_encode(['success' => true, 'data' => $result]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
