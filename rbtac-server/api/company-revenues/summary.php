<?php
// api/company-revenues/summary.php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyRevenue.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new CompanyRevenue($db);

    $companyId = $_GET['company_id'] ?? null;

    if (!$companyId) {
        http_response_code(400);
        echo json_encode(["message" => "company_id parameter is required"]);
        exit;
    }

    $response = $service->getRevenueSummary($companyId);

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
