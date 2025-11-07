<?php
include_once '../../config/database.php';

// If an ID is provided, return a single post; otherwise return the list
if (isset($_GET['id'])) {
    $id = $_GET['id'];

    $query = "SELECT b.id, b.title, b.content, b.created_at, b.user_id, u.username , b.image_url
              FROM blogPost b 
              JOIN user u ON b.user_id = u.id 
              WHERE b.id = ? 
              LIMIT 1";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(1, $id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Blog post not found."));
    }

    exit;
}

// No id provided: return all posts
$query = "SELECT b.id, b.title, b.content, b.created_at, b.user_id, u.username ,b.image_url
          FROM blogPost b 
          JOIN user u ON b.user_id = u.id 
          ORDER BY b.created_at DESC";

$stmt = $pdo->prepare($query);
$stmt->execute();

$blogPosts = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $blogPosts[] = $row;
}

http_response_code(200);
echo json_encode($blogPosts);

?>