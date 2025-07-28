<?php
// api/company-revenues/trend.php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyRevenue.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new CompanyRevenue($db);

    $companyId = $_GET['company_id'] ?? null;
    $year = $_GET['year'] ?? null;

    if (!$companyId || !$year) {
        http_response_code(400);
        echo json_encode(["message" => "company_id and year parameters are required"]);
        exit;
    }

    $response = $service->getMonthlyTrend($companyId, $year);

    echo json_encode($response);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
