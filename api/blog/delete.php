<?php
include_once '../../config/database.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(array("message" => "Unauthorized."));
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    $id = $data->id;

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
        echo json_encode(array("message" => "You can only delete your own blog posts."));
        exit;
    }

    $deleteQuery = "DELETE FROM blogPost WHERE id=:id";
    $deleteStmt = $pdo->prepare($deleteQuery);
    $deleteStmt->bindParam(':id', $id);

    if ($deleteStmt->execute()) {
        http_response_code(200);
        echo json_encode(array("message" => "Blog post was deleted."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Unable to delete blog post."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to delete blog post. Data is incomplete."));
}
?>