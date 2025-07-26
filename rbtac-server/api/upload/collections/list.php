<?php
// api/companies/list.php
include_once '../../config/Database.php';
include_once '../../models/Collection.php';
if (!isset($_GET['websiteId']) || !is_numeric($_GET['websiteId'])) {
    echo json_encode(["error" => "Invalid or missing websiteId"]);
    exit;
}
$websiteId = $_GET['websiteId'];
$database = new Database();
$db = $database->connect();


$service = new Collection($db);
$list = $service->getByWebsiteId($websiteId);

echo json_encode($list);
