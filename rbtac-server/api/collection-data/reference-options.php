<?php
// api/collection-data/reference-options.php

include_once '../../config/Database.php';
include_once '../../models/ReferenceFinder.php';

$data = json_decode(file_get_contents("php://input"));

// check if $data is a valid array and it contains values 
if (!is_array($data) || empty($data)) {
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}

// check if each item in $data has the required properties
foreach ($data as $ref) {
    if (!isset($ref->column_id) || !isset($ref->referenceCollectionId)) {
        echo json_encode(["error" => "Each reference must have column_id and referenceCollectionId"]);
        exit;
    }
}


$database = new Database();
$db = $database->connect();

$service = new ReferenceFinder($db);

$result = $service->getReferenceOptions($data);
echo json_encode($result);
