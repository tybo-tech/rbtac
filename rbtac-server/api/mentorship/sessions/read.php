<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../config/Database.php';
include_once '../../../models/MentorshipSession.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();
    $session = new MentorshipSession($db);

    // Check if specific ID is requested
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);

        // Check if details are requested
        if (isset($_GET['details']) && $_GET['details'] === 'true') {
            $result = $session->getWithDetails($id);
        } else {
            $result = $session->getById($id);
        }

        if ($result) {
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Session not found']);
        }
    } elseif (isset($_GET['company_id'])) {
        $companyId = intval($_GET['company_id']);
        $result = $session->getByCompanyId($companyId);
        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['template_id'])) {
        $templateId = intval($_GET['template_id']);
        $result = $session->getByTemplateId($templateId);
        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['recent'])) {
        $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 10;
        $result = $session->getRecent($limit);
        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['statistics'])) {
        $companyId = isset($_GET['company_id']) ? intval($_GET['company_id']) : null;
        $templateId = isset($_GET['template_id']) ? intval($_GET['template_id']) : null;
        $result = $session->getStatistics($companyId, $templateId);
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        $result = $session->getAll();
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
