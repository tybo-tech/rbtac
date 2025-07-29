<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

include_once '../../../config/Database.php';
include_once '../../../models/MentorshipCategory.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    $database = new Database();
    $db = $database->connect();
    $category = new MentorshipCategory($db);

    // Check if specific ID is requested
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $result = $category->getById($id);

        if ($result) {
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Category not found']);
        }
    } elseif (isset($_GET['template_id'])) {
        $templateId = intval($_GET['template_id']);

        // Check if hierarchical structure is requested
        if (isset($_GET['hierarchical']) && $_GET['hierarchical'] === 'true') {
            $result = $category->getHierarchical($templateId);
        } else {
            $result = $category->getByTemplateId($templateId);
        }

        echo json_encode(['success' => true, 'data' => $result]);
    } elseif (isset($_GET['parent_id'])) {
        $parentId = intval($_GET['parent_id']);
        $result = $category->getChildren($parentId);
        echo json_encode(['success' => true, 'data' => $result]);
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Template ID is required']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>
