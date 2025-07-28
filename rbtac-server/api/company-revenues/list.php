<?php
// api/company-revenues/list.php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyRevenue.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new CompanyRevenue($db);

    // Check for query parameters
    $companyId = $_GET['company_id'] ?? null;
    $year = $_GET['year'] ?? null;

    if ($companyId && $year) {
        $response = $service->getByCompanyAndYear($companyId, $year);
    } elseif ($companyId) {
        $response = $service->getByCompanyId($companyId);
    } elseif ($year) {
        $response = $service->getByYear($year);
    } else {
        $response = $service->getAll();
    }

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
