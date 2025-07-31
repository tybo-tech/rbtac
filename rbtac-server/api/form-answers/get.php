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

    $answer = $service->getFormAnswerById($answerId);

    if ($answer) {
        echo json_encode($answer);
    } else {
        echo json_encode(["message" => "Answer not found"]);
    }
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
