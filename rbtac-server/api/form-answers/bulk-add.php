<?php
include_once '../../config/Database.php';
include_once '../../models/FormAnswer.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !is_array($data) || empty($data)) {
    echo json_encode(["message" => "Array of answers is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormAnswer($db);

    // Convert array elements to objects
    $answers = array_map(function($item) {
        return (object) $item;
    }, $data);

    $service->bulkInsertAnswers($answers);

    echo json_encode(["message" => "Bulk answers created", "count" => count($answers)]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
