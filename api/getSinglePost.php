<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "root", "blogapp");
if ($conn->connect_errno) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$stmt = $conn->prepare("SELECT id, title, imageUrl, content FROM blogPost WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Post not found"]);
} else {
    echo json_encode($result->fetch_assoc());
}

$stmt->close();
$conn->close();
?>
