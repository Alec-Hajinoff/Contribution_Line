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
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

if (!isset($_SESSION['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not authenticated']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if ($input === null) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON input']);
    exit;
}

$title = $input['title'] ?? null;
$what_happened = $input['what_happened'] ?? null;
$why_it_mattered = $input['why_it_mattered'] ?? null;
$outcome_impact = $input['outcome_impact'] ?? null;
$contribution_date = $input['contribution_date'] ?? null;
$categories = $input['categories'] ?? [];

if (!$title || !$what_happened || !$why_it_mattered || !$outcome_impact) {
    echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
    exit;
}

$title = trim($title);
$what_happened = trim($what_happened);
$why_it_mattered = trim($why_it_mattered);
$outcome_impact = trim($outcome_impact);

if (!$contribution_date || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $contribution_date)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid date format. Use YYYY-MM-DD']);
    exit;
}

if (strtotime($contribution_date) > time()) {
    echo json_encode(['status' => 'error', 'message' => 'Contribution date cannot be in the future']);
    exit;
}

if (!is_array($categories)) {
    $categories = [];
}
$categories_json = json_encode($categories);

try {
    $pdo = new PDO('mysql:host=localhost;dbname=contribution_line', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    $pdo->beginTransaction();

    $stmt = $pdo->prepare('
        INSERT INTO contributions (users_id, title, what_happened, why_it_mattered, outcome_impact, contribution_date, categories)
        VALUES (:users_id, :title, :what_happened, :why_it_mattered, :outcome_impact, :contribution_date, :categories)
    ');

    $stmt->bindParam(':users_id', $_SESSION['id'], PDO::PARAM_INT);
    $stmt->bindParam(':title', $title, PDO::PARAM_STR);
    $stmt->bindParam(':what_happened', $what_happened, PDO::PARAM_STR);
    $stmt->bindParam(':why_it_mattered', $why_it_mattered, PDO::PARAM_STR);
    $stmt->bindParam(':outcome_impact', $outcome_impact, PDO::PARAM_STR);
    $stmt->bindParam(':contribution_date', $contribution_date, PDO::PARAM_STR);
    $stmt->bindParam(':categories', $categories_json, PDO::PARAM_STR);

    $stmt->execute();

    $pdo->commit();

    echo json_encode([
        'status' => 'success',
        'message' => 'Contribution added successfully'
    ]);
} catch (PDOException $e) {
    if (isset($pdo)) {
        $pdo->rollBack();
    }
    file_put_contents('error_log.txt', $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'An error occurred. Please try again later.']);
} finally {
    $pdo = null;
}
