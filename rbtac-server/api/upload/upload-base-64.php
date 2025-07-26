<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
// $baseUrl = "https://cms.tybo.co.za/api/upload/";
$baseUrl = "https://nichetrading.co.za/api/web-api/api/upload/";
// https://cms.tybo.co.za/api/upload/upload-base-64.php
//echo json_encode("https://cms.tybo.co.za/api/upload/".$returnResults);
$input = json_decode(file_get_contents("php://input"));

if ($input && isset($input->images) && is_array($input->images)) {
    $returnResults = [];

    foreach ($input->images as $imageData) {
        // Ensure $imageData is an object and has the 'image' property
        if (is_object($imageData) && isset($imageData->image)) {
            $image = $imageData->image;
            list($type, $data) = explode(';', $image);
            list(, $data) = explode(',', $data);
            $data = base64_decode($data);

            if ($data === false) {
                $returnResults[] = ['error' => 'base64_decode failed'];
                continue; // Skip to the next image
            }

            $type = strtolower(explode("/", $type)[1]);
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                $returnResults[] = ['error' => 'invalid image type'];
                continue; // Skip to the next image
            }

            $file_name = "uploads/" . time() . rand(10000, 99999) . "." . $type;
            if (!file_put_contents($file_name, $data)) {
                $returnResults[] = ['error' => 'file write failed'];
            } else {
                $returnResults[] = $baseUrl.$file_name;
            }
        } else {
            $returnResults[] = ['error' => 'Invalid image data'];
        }
    }

    echo json_encode($returnResults);} else {
    echo json_encode(['error' => 'Invalid input']);
}
