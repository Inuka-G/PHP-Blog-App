<?php
include_once '../../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->title) && !empty($data->content)) {
    $id = $data->id;
    $title = $data->title;
    $content = $data->content;

    // Check if the blog post belongs to the logged-in user
    $query = "SELECT user_id FROM blogPost WHERE id=:id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode(array("message" => "Blog post not found."));
        exit;
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row['user_id'] != $_SESSION['user_id']) {
        http_response_code(403);
        echo json_encode(array("message" => "You can only update your own blog posts."));
        exit;
    }

    $updateQuery = "UPDATE blogPost SET title=:title, content=:content WHERE id=:id";
    $updateStmt = $pdo->prepare($updateQuery);

    $updateStmt->bindParam(':title', $title);
    $updateStmt->bindParam(':content', $content);
    $updateStmt->bindParam(':id', $id);

    if ($updateStmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Blog post was updated."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to update blog post."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to update blog post. Data is incomplete."));
}
?>