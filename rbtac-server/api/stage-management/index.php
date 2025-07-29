<?php
require_once '../../config/Database.php';
require_once '../../config/headers.php';

class StageManagementAPI {
    private $conn;
    private $table = "program_stages";

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function updateStageIcons($programId) {
        try {
            // Define stage icons based on common stage types
            $stageIcons = [
                'Application Review' => 'clipboard-check',
                'Due Diligence' => 'search',
                'Program Entry' => 'sign-in-alt',
                'Development' => 'code',
                'Graduation' => 'graduation-cap',
                'Bootcamp' => 'dumbbell',
                'Mentorship' => 'user-tie',
                'Demo Day' => 'presentation',
                'Incubation' => 'seedling',
                'Acceleration' => 'rocket',
                'Funding' => 'dollar-sign',
                'Launch' => 'play-circle'
            ];

            $query = "SELECT id, title FROM " . $this->table . " WHERE program_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$programId]);
            $stages = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $updateQuery = "UPDATE " . $this->table . " SET stage_icon = ? WHERE id = ?";
            $updateStmt = $this->conn->prepare($updateQuery);

            $updated = 0;
            foreach ($stages as $stage) {
                $icon = 'clipboard-list'; // default icon

                // Find matching icon based on title
                foreach ($stageIcons as $titlePattern => $iconName) {
                    if (stripos($stage['title'], $titlePattern) !== false) {
                        $icon = $iconName;
                        break;
                    }
                }

                $updateStmt->execute([$icon, $stage['id']]);
                $updated++;
            }

            return [
                'success' => true,
                'message' => "Updated icons for $updated stages",
                'stages_updated' => $updated
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function updateStage($stageId, $data) {
        try {
            $fields = [];
            $params = [];

            if (isset($data['title'])) {
                $fields[] = "title = ?";
                $params[] = $data['title'];
            }
            if (isset($data['description'])) {
                $fields[] = "description = ?";
                $params[] = $data['description'];
            }
            if (isset($data['stage_color'])) {
                $fields[] = "stage_color = ?";
                $params[] = $data['stage_color'];
            }
            if (isset($data['stage_icon'])) {
                $fields[] = "stage_icon = ?";
                $params[] = $data['stage_icon'];
            }
            if (isset($data['expected_duration_days'])) {
                $fields[] = "expected_duration_days = ?";
                $params[] = $data['expected_duration_days'];
            }
            if (isset($data['is_milestone'])) {
                $fields[] = "is_milestone = ?";
                $params[] = $data['is_milestone'] ? 1 : 0;
            }
            if (isset($data['approval_required'])) {
                $fields[] = "approval_required = ?";
                $params[] = $data['approval_required'] ? 1 : 0;
            }

            if (empty($fields)) {
                return ['success' => false, 'error' => 'No fields to update'];
            }

            $fields[] = "updated_at = NOW()";
            $params[] = $stageId;

            $query = "UPDATE " . $this->table . " SET " . implode(', ', $fields) . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute($params);

            return [
                'success' => $result,
                'message' => $result ? 'Stage updated successfully' : 'Failed to update stage'
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    public function duplicateStage($stageId, $newTitle = null) {
        try {
            // Get original stage
            $query = "SELECT * FROM " . $this->table . " WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$stageId]);
            $original = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$original) {
                return ['success' => false, 'error' => 'Stage not found'];
            }

            // Create duplicate
            $insertQuery = "INSERT INTO " . $this->table . "
                           (program_id, title, description, stage_order, expected_duration_days,
                            min_duration_days, max_duration_days, stage_color, stage_icon,
                            is_milestone, approval_required, status)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            $newStageOrder = $this->getNextStageOrder($original['program_id']);
            $title = $newTitle ?: $original['title'] . ' (Copy)';

            $stmt = $this->conn->prepare($insertQuery);
            $result = $stmt->execute([
                $original['program_id'],
                $title,
                $original['description'],
                $newStageOrder,
                $original['expected_duration_days'],
                $original['min_duration_days'],
                $original['max_duration_days'],
                $original['stage_color'],
                $original['stage_icon'],
                $original['is_milestone'],
                $original['approval_required'],
                'active'
            ]);

            return [
                'success' => $result,
                'message' => $result ? 'Stage duplicated successfully' : 'Failed to duplicate stage',
                'new_stage_id' => $result ? $this->conn->lastInsertId() : null
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    private function getNextStageOrder($programId) {
        $query = "SELECT MAX(stage_order) as max_order FROM " . $this->table . " WHERE program_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$programId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return ($result['max_order'] ?? 0) + 1;
    }

    public function deleteStage($stageId) {
        try {
            // Check if any companies are in this stage
            $checkQuery = "SELECT COUNT(*) as count FROM company_program_stages WHERE program_stage_id = ?";
            $stmt = $this->conn->prepare($checkQuery);
            $stmt->execute([$stageId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result['count'] > 0) {
                return [
                    'success' => false,
                    'error' => 'Cannot delete stage - ' . $result['count'] . ' companies are currently in this stage'
                ];
            }

            // Delete the stage
            $deleteQuery = "DELETE FROM " . $this->table . " WHERE id = ?";
            $stmt = $this->conn->prepare($deleteQuery);
            $result = $stmt->execute([$stageId]);

            return [
                'success' => $result,
                'message' => $result ? 'Stage deleted successfully' : 'Failed to delete stage'
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
$api = new StageManagementAPI();

switch ($method) {
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);

        if (isset($input['action'])) {
            switch ($input['action']) {
                case 'update_icons':
                    $result = $api->updateStageIcons($input['program_id']);
                    break;
                case 'update_stage':
                    $result = $api->updateStage($input['stage_id'], $input['data']);
                    break;
                case 'duplicate_stage':
                    $result = $api->duplicateStage($input['stage_id'], $input['new_title'] ?? null);
                    break;
                case 'delete_stage':
                    $result = $api->deleteStage($input['stage_id']);
                    break;
                default:
                    http_response_code(400);
                    $result = ['error' => 'Invalid action'];
            }
        } else {
            http_response_code(400);
            $result = ['error' => 'No action specified'];
        }
        break;

    default:
        http_response_code(405);
        $result = ['error' => 'Method not allowed'];
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>
