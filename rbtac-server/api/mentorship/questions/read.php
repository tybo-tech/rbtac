<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../config/Database.php';
include_once '../../../models/MentorshipQuestion.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();
    $question = new MentorshipQuestion($db);

    // Check if specific ID is requested
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $result = $question->getById($id);

        if ($result) {
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Question not found']);
        }
    } elseif (isset($_GET['template_id'])) {
        $templateId = intval($_GET['template_id']);

        // Check if task triggers are requested
        if (isset($_GET['task_triggers']) && $_GET['task_triggers'] === 'true') {
            $result = $question->getTaskTriggers($templateId);
        } else {
            $result = $question->getByTemplateId($templateId);
        }

        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['category_id'])) {
        $categoryId = intval($_GET['category_id']);
        $result = $question->getByCategoryId($categoryId);
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Template ID or Category ID is required']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
