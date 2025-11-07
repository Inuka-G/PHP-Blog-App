<?php
// Top-level config for non-API PHP pages (mysqli)
require_once __DIR__ . '/config/env.php';

// read environment variables with sensible defaults
$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbName = getenv('DB_NAME') ?: 'blogapp';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';

define('DBSERVER', $dbHost);
define('DBUSERNAME', $dbUser);
define('DBPASSWORD', $dbPass);
define('DBNAME', $dbName);

/* connect to MySQL database using mysqli for legacy pages */
$db = mysqli_connect(DBSERVER, DBUSERNAME, DBPASSWORD, DBNAME);

// Check db connection
if ($db === false) {
    die("Error: connection error. " . mysqli_connect_error());
}

?>
