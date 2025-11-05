<?php
ob_start();
session_start();
require_once "config.php";

// Handle login
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['submit'])) {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $error = '';

    if (empty($email) || empty($password)) {
        $error = 'Please fill in both email and password.';
    } else {
        if ($query = $db->prepare("SELECT * FROM users WHERE email = ?")) {
            $query->bind_param('s', $email);
            $query->execute();
            $result = $query->get_result();

            if ($row = $result->fetch_assoc()) {
                if (password_verify($password, $row['password'])) {
                    // ✅ Save user to session
                    $_SESSION['userid'] = $row['id'];
                    $_SESSION['user'] = $row['name'];
                    
                    // ✅ Redirect to welcome page
                    header("Location: welcome.php");
                    exit;
                } else {
                    $error = "Invalid password.";
                }
            } else {
                $error = "No account found with that email.";
            }

            $query->close();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
</head>
<body>
<div class="container">
    <h2>Login</h2>
    <?php if (!empty($error)) echo "<div class='alert alert-danger'>$error</div>"; ?>
    <form method="POST" action="">
        <div class="form-group">
            <label>Email address</label>
            <input type="email" name="email" class="form-control" required>
        </div>
        <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" class="form-control" required>
        </div>
        <input type="submit" name="submit" value="Login" class="btn btn-primary">
    </form>
</div>
<?php ob_end_flush(); ?>
</body>
</html>
