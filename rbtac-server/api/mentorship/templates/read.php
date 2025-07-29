<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../config/Database.php';
include_once '../../../models/MentorshipTemplate.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();
    $template = new MentorshipTemplate($db);

    // Check if specific ID is requested
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);

        // Check if details are requested
        if (isset($_GET['details']) && $_GET['details'] === 'true') {
            $result = $template->getWithDetails($id);
        } else {
            $result = $template->getById($id);
        }

        if ($result) {
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Template not found']);
        }
    } else {
        // Handle search and filtering
        if (isset($_GET['search'])) {
            $result = $template->search($_GET['search']);
        } elseif (isset($_GET['category'])) {
            $result = $template->getByCategory($_GET['category']);
        } else {
            $result = $template->getAll();
        }

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
