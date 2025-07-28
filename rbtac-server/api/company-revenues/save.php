<?php
// api/company-revenues/save.php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyRevenue.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new CompanyRevenue($db);

    // Get the input data
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid JSON input"]);
        exit;
    }

    // Validate required fields
    $requiredFields = ['company_id', 'month', 'year'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || $input[$field] === '') {
            http_response_code(400);
            echo json_encode(["message" => "Field '$field' is required"]);
            exit;
        }
    }

    // Validate month and year
    if ($input['month'] < 1 || $input['month'] > 12) {
        http_response_code(400);
        echo json_encode(["message" => "Month must be between 1 and 12"]);
        exit;
    }

    if ($input['year'] < 1900 || $input['year'] > 2100) {
        http_response_code(400);
        echo json_encode(["message" => "Year must be between 1900 and 2100"]);
        exit;
    }

    $id = $input['id'] ?? null;

    if ($id) {
        // Update existing record
        $response = $service->update($id, $input);
        if ($response) {
            echo json_encode($response);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to update company revenue record"]);
        }
    } else {
        // Create new record
        $response = $service->add($input);
        if ($response) {
            http_response_code(201);
            echo json_encode($response);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to create company revenue record"]);
        }
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
