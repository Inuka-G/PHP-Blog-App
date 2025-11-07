<?php
/**
 * Simple .env loader
 * Loads variables from project .env into getenv(), $_ENV and $_SERVER.
 */
function load_dotenv($envPath = null)
{
    // default to project root .env
    if ($envPath === null) {
        $envPath = dirname(__DIR__) . '/.env';
    }

    if (!file_exists($envPath)) {
        return [];
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $vars = [];

    foreach ($lines as $line) {
        $line = trim($line);
        // skip comments
        if ($line === '' || strpos($line, '#') === 0) {
            continue;
        }

        // split on first '='
        if (strpos($line, '=') === false) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        // remove surrounding quotes
        if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') || (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
            $value = substr($value, 1, -1);
        }

        // expand vars (simple ${VAR} replacement)
        $value = preg_replace_callback('/\$\{([A-Z0-9_]+)\}/', function ($m) use (&$vars) {
            return $vars[$m[1]] ?? getenv($m[1]) ?: '';
        }, $value);

        $vars[$name] = $value;
        // export to environment
        putenv("$name=$value");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }

    return $vars;
}

// Load on include
load_dotenv();

?>
