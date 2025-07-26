<?php
// api/companies/get.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataQuery.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(["error" => "Invalid or missing ID"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new CollectionDataQuery($db);
$Collection = $service->getById($_GET['id']);

if ($Collection) {
    echo json_encode($Collection);
} else {
    echo json_encode(["error" => "Collection not found"]);
}
