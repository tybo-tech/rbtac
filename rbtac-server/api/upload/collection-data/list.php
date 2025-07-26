<?php
// api/companies/list.php
include_once '../../config/Database.php';
include_once '../../models/CollectionData.php';
if (!isset($_GET['collectionId']) || !is_numeric($_GET['collectionId'])) {
    echo json_encode(["error" => "Invalid or missing collectionId"]);
    exit;
}
$collectionId = $_GET['collectionId'];
$database = new Database();
$db = $database->connect();


$service = new CollectionData($db);
$list = $service->getByCollectionId($collectionId);

echo json_encode($list);
