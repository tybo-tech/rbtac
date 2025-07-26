<?php
// api/views/delete.php
include_once '../../config/Database.php';
include_once '../../models/View.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(["error" => "Invalid or missing ID"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new View($db);
$result = $service->remove($_GET['id']);

if ($result) {
    echo json_encode(["message" => "Component deleted successfully"]);
} else {
    echo json_encode(["error" => "Failed to delete Component"]);
}
