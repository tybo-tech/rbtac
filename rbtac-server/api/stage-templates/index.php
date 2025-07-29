<?php
require_once '../../config/Database.php';
require_once '../../config/headers.php';

class StageTemplatesAPI {
    private $conn;
    private $table = "stage_templates";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function getTemplates() {
        $query = "SELECT * FROM " . $this->table . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getTemplateById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function createTemplate($data) {
        $query = "INSERT INTO " . $this->table . " 
                 (name, description, template_data, category, is_public, created_by) 
                 VALUES (?, ?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['name'],
            $data['description'],
            json_encode($data['template_data']),
            $data['category'] ?? 'general',
            $data['is_public'] ?? true,
            $data['created_by'] ?? null
        ]);
    }

    public function applyTemplate($templateId, $programId) {
        // Get template data
        $template = $this->getTemplateById($templateId);
        if (!$template) {
            return false;
        }

        $templateData = json_decode($template['template_data'], true);
        $stages = $templateData['stages'] ?? [];

        // Create stages for the program
        $stageQuery = "INSERT INTO program_stages 
                      (program_id, title, description, stage_order, expected_duration_days, stage_color, is_milestone) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stageStmt = $this->conn->prepare($stageQuery);
        
        foreach ($stages as $index => $stage) {
            $stageStmt->execute([
                $programId,
                $stage['title'],
                $stage['description'] ?? '',
                $index + 1,
                $stage['duration'] ?? 30,
                $stage['color'] ?? '#3B82F6',
                isset($stage['is_milestone']) ? ($stage['is_milestone'] ? 1 : 0) : 0
            ]);
        }

        return true;
    }
}

// Handle requests
$method = $_SERVER['REQUEST_METHOD'];
$api = new StageTemplatesAPI();

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $result = $api->getTemplateById($_GET['id']);
        } else {
            $result = $api->getTemplates();
        }
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (isset($input['action']) && $input['action'] === 'apply_template') {
            $result = $api->applyTemplate($input['template_id'], $input['program_id']);
        } else {
            $result = $api->createTemplate($input);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        exit;
}

echo json_encode($result);
?>
