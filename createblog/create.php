<?php
// ✅ Show errors for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ✅ Database connection
$db_host = 'localhost';
$db_user = 'root';
$db_password = 'root'; // change if different
$db_name = 'blogapp';  // your database name

$conn = new mysqli($db_host, $db_user, $db_password, $db_name);

// ✅ Check connection
if ($conn->connect_errno) {
    die("❌ Database connection failed: " . $conn->connect_error);
}

// ✅ Handle POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get and sanitize form data
    $title = htmlspecialchars($_POST['title'] ?? '');
    $image_url = htmlspecialchars($_POST['image-url'] ?? '');
    $content = htmlspecialchars($_POST['content'] ?? '');

    // Validate required fields
    if (empty($title) || empty($content)) {
        die("❌ Title and Content are required fields.");
    }

    // ✅ Prepare SQL Insert
    $stmt = $conn->prepare("INSERT INTO blogPost (title, imageUrl, content) VALUES (?, ?, ?)");
    if (!$stmt) {
        die("❌ Prepare failed: " . $conn->error);
    }

    $stmt->bind_param("sss", $title, $image_url, $content);

    // ✅ Execute query
    if ($stmt->execute()) {
        echo "
        <div style='font-family: sans-serif; padding: 20px;'>
            <h1 style='color: green;'>✅ Blog Created Successfully!</h1>
            <p><strong>Title:</strong> " . htmlspecialchars($title) . "</p>
            <p><strong>Image URL:</strong> " . htmlspecialchars($image_url) . "</p>
            <p><strong>Content:</strong> " . nl2br(htmlspecialchars($content)) . "</p>
            <br>
            <a href='index.html' style='color: blue; text-decoration: underline;'>⬅️ Back to Create Another</a>
        </div>";
    } else {
        echo "❌ Error inserting data: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Invalid request method.";
}

$conn->close();
?>
