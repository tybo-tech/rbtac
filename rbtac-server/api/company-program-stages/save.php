<?php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyProgramStage.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $connection = new Database();
        $db = $connection->connect();
        $service = new CompanyProgramStage($db);

        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid JSON input"]);
            exit;
        }

        // Handle different transition types
        $action = $input['action'] ?? 'advance';
        $company_id = $input['company_id'] ?? null;
        $program_id = $input['program_id'] ?? null;
        $user_id = $input['user_id'] ?? null;

        if (!$company_id || !$program_id) {
            http_response_code(400);
            echo json_encode(["message" => "Company ID and Program ID are required"]);
            exit;
        }

        switch ($action) {
            case 'advance':
                // Move to next stage in sequence
                $result = $service->advanceToNextStage($company_id, $program_id, $user_id);
                break;

            case 'move_to':
                // Move to specific stage
                $target_stage_id = $input['target_stage_id'] ?? null;
                if (!$target_stage_id) {
                    http_response_code(400);
                    echo json_encode(["message" => "Target stage ID is required for move_to action"]);
                    exit;
                }
                $result = $service->moveToStage($company_id, $program_id, $target_stage_id, $user_id);
                break;

            case 'create':
                // Create new stage record manually
                $program_stage_id = $input['program_stage_id'] ?? null;
                if (!$program_stage_id) {
                    http_response_code(400);
                    echo json_encode(["message" => "Program stage ID is required for create action"]);
                    exit;
                }
                $stageId = $service->add([
                    'company_id' => $company_id,
                    'program_id' => $program_id,
                    'program_stage_id' => $program_stage_id
                ]);
                $result = $service->getById($stageId);
                break;

            default:
                http_response_code(400);
                echo json_encode(["message" => "Invalid action. Use 'advance', 'move_to', or 'create'"]);
                exit;
        }

        if ($result) {
            echo json_encode($result);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Failed to perform stage transition"]);
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["message" => "Error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
}
?>
