<?php
include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->email) && !empty($data->password)) {
    $username = $data->username;
    $email = $data->email;
    $password = password_hash($data->password, PASSWORD_DEFAULT);

    $query = "INSERT INTO user SET username=:username, email=:email, password=:password";
    $stmt = $pdo->prepare($query);

    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "User was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create user."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}
?>