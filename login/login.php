<?php
session_start();

// Example hardcoded credentials
$valid_email = "user@user.com";
$valid_password = "12345";

// Get form values
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
echo "<script>
console.log('Login Attempt: ${email}
        ${password}');
        
    </script>";
// Check credentials
// if ($email === $valid_email && $password === $valid_password) {
//     $_SESSION['user'] = $email;
//     header("Location: dashboard.php"); // redirect after login
//     exit();
// } else {
//     echo "<script>
//         alert('Invalid email or password!');
//         window.location.href = 'index.html'; // back to login
//     </script>";
// }
?>
