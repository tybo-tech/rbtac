<?php
// api/collection-data/getByParentId.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataQuery.php';

if (!isset($_GET['parent_id']) || empty($_GET['parent_id'])) {
    echo json_encode(["error" => "Missing parent_id"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new CollectionDataQuery($db);
$result = $service->getByParentId($_GET['parent_id']);

echo json_encode($result);
