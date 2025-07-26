<?php
include_once '../../config/Database.php';
include_once '../../models/UserCrud.php';

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->name) || !isset($data->email) || !isset($data->password) || !isset($data->website_id)) {
    echo json_encode(array("error" => "Invalid data. Name, email, password, and website_id are required."));
    return;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $userCrud = new UserCrud($db);

    $checkEmail = $userCrud->getUserByEmail($data->email, $data->website_id);
    if ($checkEmail && isset($checkEmail['user_id'])) {
        echo json_encode(array("error" => "Email already exists.", "user" => $checkEmail));
        return;
    }
    $response = $userCrud->registerUser($data);

    echo json_encode($response);
} catch (Exception $e) {
    echo json_encode(array("error" => "Error: " . $e->getMessage()));
}
?>