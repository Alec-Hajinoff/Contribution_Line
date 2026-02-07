<?php
require_once 'session_config.php';

$allowed_origins = [
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
    exit;
}

$userid = (int) $_SESSION['id'];

$servername = '127.0.0.1';
$username = 'root';
$passwordServer = '';
$dbname = 'contribution_line';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $stmt = $conn->prepare('SELECT `name`, `current_role`, `current_company` FROM `users` WHERE `id` = :id LIMIT 1');
    $stmt->bindValue(':id', $userid, PDO::PARAM_INT);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user !== false) {
        $name = isset($user['name']) ? $user['name'] : '';
        $current_role = isset($user['current_role']) ? $user['current_role'] : '';
        $current_company = isset($user['current_company']) ? $user['current_company'] : '';

        file_put_contents('profile_section_get_debug.txt', date('c') . " USERID={$userid} ROW=" . json_encode($user) . PHP_EOL, FILE_APPEND);

        echo json_encode([
            'status' => 'success',
            'name' => $name,
            'current_role' => $current_role,
            'current_company' => $current_company
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found']);
    }
} catch (PDOException $e) {
    file_put_contents('error_log.txt', $e->getMessage() . PHP_EOL, FILE_APPEND);
    file_put_contents('profile_section_get_debug.txt', date('c') . ' ERROR: ' . $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'An error occurred.']);
} finally {
    $conn = null;
}
