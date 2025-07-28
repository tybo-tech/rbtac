<?php
// api/collection-data/getByCollectionAndParent.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataQuery.php';

if (!isset($_GET['collection_id']) || empty($_GET['collection_id']) ||
    !isset($_GET['parent_id']) || empty($_GET['parent_id'])) {
    echo json_encode(["error" => "Missing collection_id or parent_id"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new CollectionDataQuery($db);
$result = $service->getByCollectionAndParent($_GET['collection_id'], $_GET['parent_id']);

echo json_encode($result);
