<?php
require_once '../config/Database.php';
require_once '../models/MentorshipTemplate.php';

$database = new Database();
$db = $database->getConnection();
$mentorshipTemplate = new MentorshipTemplate($db);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            // Get specific template with full structure
            $result = $mentorshipTemplate->getById($_GET['id']);
            if ($result) {
                echo json_encode(['success' => true, 'data' => $result]);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Template not found']);
            }
        } elseif (isset($_GET['program_type'])) {
            // Get templates by program type
            $result = $mentorshipTemplate->getByProgramType($_GET['program_type']);
            echo json_encode(['success' => true, 'data' => $result]);
        } else {
            // Get all templates
            $result = $mentorshipTemplate->getAll();
            echo json_encode(['success' => true, 'data' => $result]);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($_GET['action']) && $_GET['action'] === 'seed_baseline') {
            // Seed the baseline template
            $result = $mentorshipTemplate->seedBaselineTemplate();
            echo json_encode($result);
        } else {
            // Create new template
            $result = $mentorshipTemplate->create($data);
            echo json_encode($result);
        }
        break;

    case 'PUT':
        if (isset($_GET['id'])) {
            $data = json_decode(file_get_contents("php://input"), true);
            $result = $mentorshipTemplate->update($_GET['id'], $data);
            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Template ID required']);
        }
        break;

    case 'DELETE':
        if (isset($_GET['id'])) {
            $result = $mentorshipTemplate->delete($_GET['id']);
            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Template ID required']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
        break;
}
?>
