<?php
include_once '../../config/Database.php';
include_once '../../models/FormAnswer.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['id'])) {
    echo json_encode(["message" => "Answer ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormAnswer($db);

    $service->updateFormAnswer((object) $data);
    echo json_encode(["message" => "Form answer updated"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
