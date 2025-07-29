<?php
include_once '../../config/Database.php';
include_once '../../config/headers.php';
include_once '../../models/CompanyProgramStage.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new CompanyProgramStage($db);

    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;

    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "Company program stage ID is required"]);
        exit;
    }

    $result = $service->getById($id);

    if ($result) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Company program stage not found"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
