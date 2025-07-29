<?php
require_once '../config/Database.php';
require_once '../models/MentorshipSession.php';

$database = new Database();
$db = $database->getConnection();
$mentorshipSession = new MentorshipSession($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Get specific session with responses
            $result = $mentorshipSession->getByIdWithResponses($_GET['id']);
            if ($result) {
                echo json_encode(['success' => true, 'data' => $result]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Session not found']);
            }
        } elseif (isset($_GET['company_id'])) {
            // Get sessions by company
            $result = $mentorshipSession->getByCompany($_GET['company_id']);
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            // Get all sessions
            $result = $mentorshipSession->getAll();
            echo json_encode(['success' => true, 'data' => $result]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($_GET['action']) && $_GET['action'] === 'save_responses') {
            // Save session responses
            $result = $mentorshipSession->saveResponses($data['session_id'], $data['responses']);
            echo json_encode($result);
        } else {
            // Create new session
            $result = $mentorshipSession->create($data);
            echo json_encode($result);
        }
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $mentorshipSession->update($_GET['id'], $data);
            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Session ID required']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
