<?php
// api/views/list.php
include_once '../../config/Database.php';
include_once '../../models/OtherInfo.php';


$database = new Database();
$db = $database->connect();


$service = new OtherInfo($db);
$list = $service->importWalkins();

echo json_encode($list);
