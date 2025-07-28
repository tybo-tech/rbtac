<?php
// api/collection-data/getAllByCollection.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataQuery.php';

if (!isset($_GET['collection_id']) || empty($_GET['collection_id'])) {
    echo json_encode(["error" => "Missing collection_id"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new CollectionDataQuery($db);
$result = $service->getAllByCollection($_GET['collection_id']);

echo json_encode($result);
