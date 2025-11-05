<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data safely
    $title = htmlspecialchars($_POST['title'] ?? '');
    $imageUrl = htmlspecialchars($_POST['image-url'] ?? '');
    $content = htmlspecialchars($_POST['content'] ?? '');

    // Example: show the submitted data
    echo "<h1>Blog Created Successfully!</h1>";
    echo "<p><strong>Title:</strong> $title</p>";
    echo "<p><strong>Image URL:</strong> $imageUrl</p>";
    echo "<p><strong>Content:</strong> $content</p>";
    echo "<br><a href='index.html'>Back</a>";
} else {
    echo "Invalid request method.";
}
?>
