<?php
include_once '../../config/Database.php';
include_once '../../models/FormTemplate.php';

$statusId = $_GET['status_id'] ?? null;
$summary = $_GET['summary'] ?? 'true'; // Default to summary view

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormTemplate($db);

    // Use optimized summary list for UI, full list for specific cases
    if ($summary === 'false') {
        $templates = $service->list($statusId);
    } else {
        $templates = $service->listSummary($statusId);
    }

    // Return data in ApiResponse format for Angular
    echo json_encode([
        "success" => true,
        "data" => $templates,
        "message" => "Templates retrieved successfully"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
