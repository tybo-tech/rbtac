<?php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyProgramStage.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $connection = new Database();
        $db = $connection->connect();
        $service = new CompanyProgramStage($db);

        // Get JSON input for ID
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? $_GET['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["message" => "Company program stage ID is required"]);
            exit;
        }

        $result = $service->remove($id);

        if ($result) {
            echo json_encode(["message" => "Company program stage deleted successfully"]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Failed to delete company program stage"]);
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
