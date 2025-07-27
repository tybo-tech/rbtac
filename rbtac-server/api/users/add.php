<?php
// api/users/add.php
include_once '../../config/Database.php';
include_once '../../models/User.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['name'])) {
    echo json_encode(["message" => "User name is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new User($db);

    $response = $service->add($data);

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
