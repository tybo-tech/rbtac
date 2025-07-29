<?php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/ProgramStage.php';

// Handle both POST (create) and PUT (update) requests
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $connection = new Database();
        $db = $connection->connect();
        $service = new ProgramStage($db);

        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid JSON input"]);
            exit;
        }

        // Validate required fields
        if (empty($input['program_id']) || empty($input['title'])) {
            http_response_code(400);
            echo json_encode(["message" => "Program ID and title are required"]);
            exit;
        }

        if (isset($input['id']) && $input['id']) {
            // Update existing stage
            $result = $service->update($input['id'], $input);
            if ($result) {
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Failed to update program stage"]);
            }
        } else {
            // Create new stage
            $result = $service->add($input);
            if ($result) {
                http_response_code(201);
                echo json_encode($result);
            } else {
                http_response_code(400);
                echo json_encode(["message" => "Failed to create program stage"]);
            }
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
