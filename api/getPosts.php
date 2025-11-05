<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

// Database connection
$mysqli = new mysqli("localhost", "root", "root", "blogapp");

// Check connection
if ($mysqli->connect_errno) {
    echo json_encode(["error" => "Failed to connect: " . $mysqli->connect_error]);
    exit();
}

// Fetch all blog posts
$sql = "SELECT id, title, imageUrl, content FROM blogPost ORDER BY id DESC";
$result = $mysqli->query($sql);

$posts = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }
}

echo json_encode($posts);

$mysqli->close();
?>
