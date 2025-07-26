<?php
include_once '../../config/Database.php';
include_once '../../models/UserCrud.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->user_id) || !isset($data->website_id)) {
    echo json_encode(array("message" => "Invalid data. User ID and Website ID are required."));
    return;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $userCrud = new UserCrud($db);

    // Update user information
    $response = $userCrud->updateUserInfo($data);

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(array("message" => "Error: " . $e->getMessage()));
}
?>
