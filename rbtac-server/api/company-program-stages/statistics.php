<?php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyProgramStage.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new CompanyProgramStage($db);

    $program_id = isset($_GET['program_id']) ? (int)$_GET['program_id'] : null;

    if (!$program_id) {
        http_response_code(400);
        echo json_encode(["message" => "Program ID is required"]);
        exit;
    }

    $result = $service->getStageStatistics($program_id);
    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
