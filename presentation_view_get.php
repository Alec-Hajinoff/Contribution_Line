<?php

$allowed_origins = ['http://localhost:3000'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$presentationId = $_GET['id'] ?? null;

if (!$presentationId) {
    echo json_encode(['status' => 'error', 'message' => 'Missing presentation ID.']);
    exit;
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=contribution_line', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
    ]);

    $stmt = $pdo->prepare('SELECT name, contributions_id, created_at FROM presentation_view WHERE id = ?');
    $stmt->execute([$presentationId]);
    $view = $stmt->fetch();

    if (!$view) {
        echo json_encode(['status' => 'error', 'message' => 'Presentation not found.']);
        exit;
    }

    $ids = json_decode($view['contributions_id'], true);

    if (empty($ids)) {
        echo json_encode([
            'name' => $view['name'],
            'created_at' => $view['created_at'],
            'contributions' => []
        ]);
        exit;
    }

    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $sql = "SELECT id, title, what_happened, why_it_mattered, outcome_impact, contribution_date, categories 
            FROM contributions 
            WHERE id IN ($placeholders) 
            ORDER BY contribution_date DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($ids);
    $contributions = $stmt->fetchAll();

    foreach ($contributions as &$contribution) {
        $cId = $contribution['id'];

        $linkStmt = $pdo->prepare('SELECT url, label FROM evidence_links WHERE contributions_id = ?');
        $linkStmt->execute([$cId]);
        $contribution['evidence_links'] = $linkStmt->fetchAll();

        $fileStmt = $pdo->prepare('SELECT id, file_name, mime_type FROM files WHERE contributions_id = ?');
        $fileStmt->execute([$cId]);
        $contribution['files'] = $fileStmt->fetchAll();
    }

    echo json_encode([
        'status' => 'success',
        'name' => $view['name'],
        'created_at' => $view['created_at'],
        'contributions' => $contributions
    ]);
} catch (PDOException $e) {
    file_put_contents('error_log.txt', 'Presentation Get Error: ' . $e->getMessage() . PHP_EOL, FILE_APPEND);
    echo json_encode(['status' => 'error', 'message' => 'Database error.']);
}
