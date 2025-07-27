<?php
// api/programs/delete.php
include_once '../../config/Database.php';
include_once '../../models/Program.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode(["message" => "Program ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new Program($db);

    $success = $service->remove($data->id);

    echo json_encode(["success" => $success]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
