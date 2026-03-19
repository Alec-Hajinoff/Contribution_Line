<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$allowed_origins = [
    'http://localhost:3000',
    'https://contributionline.com',
    'https://www.contributionline.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin !== null && in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($origin === null) {
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

try {
    $_SESSION = array();

    if (isset($_COOKIE[session_name()])) {
        setcookie(session_name(), '', time() - 3600, '/');
    }

    session_destroy();

    http_response_code(200);
    echo json_encode(array(
        'ok' => true,
        'message' => 'Successfully logged out'
    ));
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'ok' => false,
        'message' => 'Error during logout: ' . $e->getMessage()
    ));
}
