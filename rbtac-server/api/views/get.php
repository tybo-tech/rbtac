<?php
// api/views/get.php
include_once '../../config/Database.php';
include_once '../../models/View.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(["error" => "Invalid or missing ID"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new View($db);
$View = $service->getById($_GET['id']);

if ($View) {
    echo json_encode($View);
} else {
    echo json_encode(["error" => "View not found"]);
}
