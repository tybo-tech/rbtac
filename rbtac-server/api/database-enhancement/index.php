<?php
require_once '../../config/Database.php';
require_once '../../config/headers.php';

class DatabaseEnhancementAPI {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function executeEnhancement() {
        try {
            // Read the enhanced schema file
            $schemaPath = '../../enhanced-stages-schema.sql';

            if (!file_exists($schemaPath)) {
                return [
                    'success' => false,
                    'error' => 'Enhanced schema file not found at: ' . realpath('.') . '/' . $schemaPath
                ];
            }

            $sql = file_get_contents($schemaPath);
            $statements = array_filter(array_map('trim', explode(';', $sql)));

            $results = [];
            $successCount = 0;
            $errorCount = 0;

            foreach ($statements as $index => $statement) {
                if (!empty($statement)) {
                    try {
                        $this->conn->exec($statement);
                        $results[] = [
                            'statement' => $index + 1,
                            'preview' => substr($statement, 0, 80) . '...',
                            'status' => 'success'
                        ];
                        $successCount++;
                    } catch (Exception $e) {
                        $results[] = [
                            'statement' => $index + 1,
                            'preview' => substr($statement, 0, 80) . '...',
                            'status' => 'error',
                            'error' => $e->getMessage()
                        ];
                        $errorCount++;
                    }
                }
            }

            return [
                'success' => true,
                'summary' => [
                    'total_statements' => count($statements),
                    'successful' => $successCount,
                    'errors' => $errorCount
                ],
                'details' => $results
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function checkEnhancementStatus() {
        try {
            $checks = [];

            // Check if new columns exist in program_stages
            $result = $this->conn->query("SHOW COLUMNS FROM program_stages LIKE 'expected_duration_days'");
            $checks['program_stages_enhanced'] = $result->rowCount() > 0;

            // Check if new columns exist in company_program_stages
            $result = $this->conn->query("SHOW COLUMNS FROM company_program_stages LIKE 'stage_progress_percentage'");
            $checks['company_program_stages_enhanced'] = $result->rowCount() > 0;

            // Check if new tables exist
            $result = $this->conn->query("SHOW TABLES LIKE 'stage_transitions'");
            $checks['stage_transitions_table'] = $result->rowCount() > 0;

            $result = $this->conn->query("SHOW TABLES LIKE 'stage_templates'");
            $checks['stage_templates_table'] = $result->rowCount() > 0;

            $result = $this->conn->query("SHOW TABLES LIKE 'stage_analytics'");
            $checks['stage_analytics_table'] = $result->rowCount() > 0;

            // Check if sample data exists
            $result = $this->conn->query("SELECT COUNT(*) as count FROM stage_templates");
            $templateCount = $result->fetch(PDO::FETCH_ASSOC);
            $checks['sample_templates_loaded'] = $templateCount['count'] > 0;

            return [
                'success' => true,
                'enhancement_status' => $checks,
                'all_enhancements_applied' => !in_array(false, $checks)
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function getStageTemplates() {
        try {
            $query = "SELECT * FROM stage_templates ORDER BY created_at DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();

            return [
                'success' => true,
                'templates' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}

// Handle requests
$method = $_SERVER['REQUEST_METHOD'];
$api = new DatabaseEnhancementAPI();

switch ($method) {
    case 'GET':
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'status':
                    $result = $api->checkEnhancementStatus();
                    break;
                case 'templates':
                    $result = $api->getStageTemplates();
                    break;
                default:
                    http_response_code(400);
                    $result = ['error' => 'Invalid action'];
            }
        } else {
            $result = $api->checkEnhancementStatus();
        }
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (isset($input['action']) && $input['action'] === 'enhance') {
            $result = $api->executeEnhancement();
        } else {
            http_response_code(400);
            $result = ['error' => 'Invalid action'];
        }
        break;

    default:
        http_response_code(405);
        $result = ['error' => 'Method not allowed'];
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>
