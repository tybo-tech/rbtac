<?php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/ProgramStage.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new ProgramStage($db);

    // Check if program_id is provided
    $program_id = isset($_GET['program_id']) ? (int)$_GET['program_id'] : null;

    if ($program_id) {
        // Get stages for specific program
        $result = $service->getByProgramId($program_id);
    } else {
        // Get all stages
        $result = $service->getAll();
    }

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
