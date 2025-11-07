<?php
include_once '../../config/database.php';

session_start();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    $username = $data->username;

    $query = "SELECT id, username, password FROM user WHERE username=:username";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    if ($stmt->rowCount() == 1) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $row['id'];
        $username = $row['username'];
        $hashed_password = $row['password'];

        if (password_verify($data->password, $hashed_password)) {
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;

            http_response_code(200);
            echo json_encode(array("message" => "Login successful.", "user_id" => $id, "username" => $username));
        } else {
            http_response_code(401);
            echo json_encode(array("message" => "Login failed."));
        }
    } else {
        http_response_code(401);
        echo json_encode(array("message" => "Login failed."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
}
?>