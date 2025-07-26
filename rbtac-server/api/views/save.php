<?php
// api/views/save.php
include_once '../../config/Database.php';
include_once '../../models/View.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->name)) {
    echo json_encode(["error" => "type is required"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new View($db);

if (!empty($data->id)) {
    $result = $service->update(
        $data->id,
        $data->name,
        $data->type,
        $data->field,
        $data->config,
    );
} else {
    $result = $service->add(
        $data->collection_id,
        $data->name,
        $data->type,
        $data->field,
        $data->config
    );
}

echo json_encode($result);
