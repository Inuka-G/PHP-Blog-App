<?php
include_once '../../config/database.php';

session_start();

$data = json_decode(file_get_contents("php://input"));

// Accept either username or email in the identifier field
$identifier = isset($data->username) ? trim($data->username) : '';
$password = isset($data->password) ? $data->password : '';

if ($identifier === '' || $password === '') {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
    exit;
}

$user = null;

// Try the common table `users` first (some parts of app use this)
$query1 = "SELECT id, name AS username, email, password FROM users WHERE email = :ident OR name = :ident LIMIT 1";
$stmt = $pdo->prepare($query1);
$stmt->bindParam(':ident', $identifier);
try {
    $stmt->execute();
    if ($stmt->rowCount() == 1) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    }
} catch (Exception $e) {
    // silently ignore and try alternate table below
}

// If not found, try `user` table used by API scaffolding
if (!$user) {
    $query2 = "SELECT id, username, email, password FROM user WHERE username = :ident OR email = :ident LIMIT 1";
    $stmt2 = $pdo->prepare($query2);
    $stmt2->bindParam(':ident', $identifier);
    try {
        $stmt2->execute();
        if ($stmt2->rowCount() == 1) {
            $user = $stmt2->fetch(PDO::FETCH_ASSOC);
        }
    } catch (Exception $e) {
        // ignore
    }
}

if (!$user) {
    http_response_code(401);
    echo json_encode(array("message" => "Login failed."));
    exit;
}

$hashed_password = $user['password'];

if (password_verify($password, $hashed_password)) {
    // set session vars
    $_SESSION['user_id'] = $user['id'];
    // normalize username field name
    $_SESSION['username'] = isset($user['username']) ? $user['username'] : (isset($user['name']) ? $user['name'] : '');

    http_response_code(200);
    echo json_encode(array("message" => "Login successful.", "user_id" => $user[id], "username" => $_SESSION['username']));
    exit;
} else {
    http_response_code(401);
    echo json_encode(array("message" => "Login failed."));
    exit;
}
?>