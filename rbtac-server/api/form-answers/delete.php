<?php
include_once '../../config/Database.php';
include_once '../../models/FormAnswer.php';

$answerId = $_GET['id'] ?? null;

if (!$answerId) {
    echo json_encode(["message" => "Answer ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new FormAnswer($db);

    $service->deleteFormAnswer($answerId);
    echo json_encode(["message" => "Form answer deleted"]);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
