<?php
// api/companies/save-many.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataMutation.php';

$list = json_decode(file_get_contents("php://input"));

// Validate the input
if (!$list || !is_array($list) || empty($list)) {
    echo json_encode(["error" => "Invalid or missing data"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new CollectionDataMutation($db);

// loop through each item in the list
$response = [];
foreach ($list as $data) {


    if (!empty($data->id)) {
        $result = $service->update(
            $data->id,
            $data->data
        );
        $response[] = $result;
    } else {
        $result = $service->add(
            $data->collection_id,
            $data->data
        );
        $response[] = $result;
    }
}
echo json_encode($response);
