<?php
// api/companies/save.php
include_once '../../config/Database.php';
include_once '../../models/Collection.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->name)) {
    echo json_encode(["error" => "type is required"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new Collection($db);

if (!empty($data->id)) {
    $result = $service->update(
        $data->id,
        $data->name,
        $data->columns
    );
} else {
    $result = $service->add(
        $data->websiteId,
        $data->name,
        $data->columns
    );
}

echo json_encode($result);
