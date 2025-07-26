<?php
// api/views/list.php
include_once '../../config/Database.php';
include_once '../../models/View.php';

$collectionId = isset($_GET['collectionId']) ? $_GET['collectionId'] : null;
if (!$collectionId || !is_numeric($collectionId)) {
    echo json_encode(["error" => "Invalid or missing collectionId"]);
    exit;
}

$database = new Database();
$db = $database->connect();


$service = new View($db);
$list = $service->getByCollectionId($collectionId);

echo json_encode($list);
