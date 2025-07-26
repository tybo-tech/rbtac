<?php
include_once '../../config/Database.php';
include_once '../../models/UserCrud.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->email) || !isset($data->newPassword) || !isset($data->website_id)) {
    echo json_encode(array("message" => "Invalid data. Email, new password, and website_id are required."));
    return;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $userCrud = new UserCrud($db);
    
    $response = $userCrud->resetPassword($data);

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
}
?>
