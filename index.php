<?php
$path = $_GET['path'] ?? '';

switch ($path) {
    case '':
        include 'home/index.html';
        break;
    case 'singlepost':
        include 'singlepost';
        break;
    case 'createblog':
        include 'createblog';
        break;
    case 'login':
        include 'login';
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
