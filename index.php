
<?php
$path = $_GET['path'] ?? '';

switch ($path) {
    case '':
        include 'home/index.html';
        break;
    case 'singlepost':
        include 'singleblog/index.html';
        break;
    case 'createblog':
        include 'createblog/index.html';
        break;
    case 'login':
        include 'login/index.html';
        break;
    case 'register':
        include 'register/index.php';
        break;
    default:
        http_response_code(404);
        echo "<h1>404 - Page Not Found</h1>";
        break;
}
?>

<script>
  console.log("Current path: '<?php echo $path; ?>'");
</script>