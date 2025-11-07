<?php
include_once '../../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->title) && !empty($data->content)) {
    $user_id = $_SESSION['user_id'];
    $title = $data->title;
    $content = $data->content;
    $image_url = $data->image_url;

    $query = "INSERT INTO blogPost SET user_id=:user_id, title=:title, content=:content, image_url=:image_url";
    $stmt = $pdo->prepare($query);

    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':content', $content);
    $stmt->bindParam(':image_url', $image_url);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(array("message" => "Blog post was created."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to create blog post."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create blog post. Data is incomplete."));
}
?>