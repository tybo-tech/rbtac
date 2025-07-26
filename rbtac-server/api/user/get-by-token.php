<?php
include_once '../../config/Database.php';
include_once '../../models/UserCrud.php';
$token = $_GET['token'] ?? '';
try {
    $connection = new Database();
    $db = $connection->connect();
    $userCrud = new UserCrud($db);
    
    $response = $userCrud->getUserByToken($token);

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
}
?>
