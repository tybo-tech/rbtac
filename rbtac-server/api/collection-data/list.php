<?php
// api/companies/list.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataQuery.php';
if (!isset($_GET['collectionId']) || !is_numeric($_GET['collectionId'])) {
    echo json_encode(["error" => "Invalid or missing collectionId"]);
    exit;
}
$collectionId = $_GET['collectionId'];
$database = new Database();
$db = $database->connect();


$service = new CollectionDataQuery($db);
$list = $service->findMany($collectionId);

echo json_encode($list);
