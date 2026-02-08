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
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not authenticated']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if ($input === null) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
    exit;
}

$field = $input['field'] ?? null;
$value = array_key_exists('value', $input) ? $input['value'] : null;

$allowed_fields = ['name', 'current_role', 'current_company'];

if (!$field || !in_array($field, $allowed_fields, true)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid field']);
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

    $conn->beginTransaction();

    $sql = "UPDATE users SET `{$field}` = :value WHERE id = :id";
    $stmt = $conn->prepare($sql);

    if ($value === null) {
        $stmt->bindValue(':value', null, PDO::PARAM_NULL);
    } else {
        $stmt->bindValue(':value', (string) $value, PDO::PARAM_STR);
    }
    $stmt->bindValue(':id', $userid, PDO::PARAM_INT);

    $stmt->execute();
    $affected = $stmt->rowCount();

    $conn->commit();

    echo json_encode(['status' => 'success', 'affected' => $affected]);
} catch (PDOException $e) {
    if (isset($conn)) {
        $conn->rollBack();
    }

    echo json_encode(['status' => 'error', 'message' => 'An error occurred.']);
} finally {
    $conn = null;
}
