<?php
include_once '../../config/Database.php';
include_once '../../models/UserCrud.php';
try {
    $connection = new Database();
    $db = $connection->connect();
    $userCrud = new UserCrud($db);
    
    $response = $userCrud->all();

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
}
?>
