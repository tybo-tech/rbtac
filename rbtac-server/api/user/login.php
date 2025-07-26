<?php
session_start(); // Start the session if it hasn't been started

include_once '../../config/Database.php';
include_once '../../models/UserCrud.php';

// Parse JSON input
$data = json_decode(file_get_contents("php://input"), false);

// Check if required fields are provided
if (!isset($data->email) || !isset($data->password) || !isset($data->website_id)) {
    // http_response_code(400); // Bad request
    echo json_encode(array("error" => "Invalid data. Email, password, and website_id are required."));
    return;
}

try {
    // Establish database connection
    $connection = new Database();
    $db = $connection->connect();
    $userCrud = new UserCrud($db);

    // Attempt to log in the user
    $response = $userCrud->loginUser($data);

    // Check login response
    if ($response) {
        // Set user ID in the session
        $_SESSION['user_id'] = $response['user_id'];

        // http_response_code(200); // OK
        echo json_encode($response);
    } else {
        //  http_response_code(401); // Unauthorized
        echo json_encode(array("error" => "Invalid login credentials."));
    }
} catch (Exception $e) {
    //  http_response_code(500); // Internal server error
    echo json_encode(array("error" => "Error: " . $e->getMessage()));
}

