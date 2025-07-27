<?php
// api/companies/list.php
include_once '../../config/Database.php';
include_once '../../models/Company.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new Company($db);

    $response = $service->getAll();

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
