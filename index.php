<?php
$path = $_GET['path'] ?? '';

switch ($path) {
    case '':
        include 'home.php';
        break;
    case 'singlepost':
        include 'singlepost.php';
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
