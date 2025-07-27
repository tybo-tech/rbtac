<?php
// api/suppliers/list.php
include_once '../../config/Database.php';
include_once '../../models/Supplier.php';

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new Supplier($db);

    $response = $service->getAll();

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
