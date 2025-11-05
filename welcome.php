<?php
ob_start();
session_start();

// If not logged in, redirect to login
if (!isset($_SESSION['userid'])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Welcome</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
</head>
<body>
<div class="container">
    <h1>Welcome, <?php echo htmlspecialchars($_SESSION['user']); ?>!</h1>
    <a href="logout.php" class="btn btn-danger">Logout</a>
</div>
<?php ob_end_flush(); ?>
</body>
</html>
