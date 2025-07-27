<?php
// api/users/login.php
include_once '../../config/Database.php';
include_once '../../models/User.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password)) {
    echo json_encode(["message" => "Email and password are required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();
    $service = new User($db);

    $user = $service->login($data->email, $data->password);

    if ($user) {
        echo json_encode($user);
    } else {
        echo json_encode(["message" => "Invalid login credentials."]);
    }
} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
?>
