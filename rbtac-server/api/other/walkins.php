<?php
// api/views/list.php
include_once '../../config/Database.php';
include_once '../../models/RevenueImport.php';


$database = new Database();
$db = $database->connect();


$service = new RevenueImport($db);
$list = $service->importRevenue();

echo json_encode($list);
