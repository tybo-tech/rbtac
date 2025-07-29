<?php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyProgramStage.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new CompanyProgramStage($db);

    $company_id = isset($_GET['company_id']) ? (int)$_GET['company_id'] : null;
    $program_id = isset($_GET['program_id']) ? (int)$_GET['program_id'] : null;
    $current_only = isset($_GET['current_only']) ? (bool)$_GET['current_only'] : false;

    if ($company_id && $program_id) {
        if ($current_only) {
            // Get current stage only
            $result = $service->getCurrentStage($company_id, $program_id);
            echo json_encode($result ?: null);
        } else {
            // Get all stages for company in program
            $result = $service->getByCompanyAndProgram($company_id, $program_id);
            echo json_encode($result);
        }
    } elseif ($program_id) {
        // Get all companies in program with their current stages
        $result = $service->getCompaniesByProgram($program_id);
        echo json_encode($result);
    } else {
        // Get all company program stages
        $result = $service->getAll();
        echo json_encode($result);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
