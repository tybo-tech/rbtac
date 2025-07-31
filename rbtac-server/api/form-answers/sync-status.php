<?php
include_once '../../config/Database.php';
include_once '../../models/FormAnswerSync.php';
include_once '../../models/FormSession.php';

$sessionId = $_GET['session_id'] ?? null;

if (!$sessionId) {
    echo json_encode(["message" => "Session ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();

    $sessionService = new FormSession($db);
    $answerService = new FormAnswer($db);
    $sync = new FormAnswerSync($db);

    // Get session details
    $session = $sessionService->getSessionWithTemplate($sessionId);
    if (!$session) {
        echo json_encode(["message" => "Session not found."]);
        exit;
    }

    // Check sync status
    $answers = $answerService->getAnswersBySession($sessionId);
    $formattedAnswers = $answerService->getFormattedAnswersForSession($sessionId);

    // Calculate expected vs actual answer count
    $valueCount = 0;
    if ($session['values']) {
        $valueCount = $this->countFormValues($session['values']);
    }

    $syncStatus = [
        'session_id' => $sessionId,
        'template_title' => $session['template_title'],
        'session_updated' => $session['updated_at'],
        'answers_count' => count($answers),
        'values_count_estimate' => $valueCount,
        'sync_appears_current' => count($answers) > 0,
        'last_sync_stats' => $sync->getLastSyncStats(),
        'sample_answers' => array_slice($answers, 0, 5), // First 5 for preview
        'formatted_preview' => $formattedAnswers
    ];

    echo json_encode($syncStatus);

} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}

// Helper function to estimate value count
function countFormValues($values, $depth = 0) {
    if ($depth > 3) return 0; // Prevent infinite recursion

    $count = 0;
    foreach ($values as $key => $value) {
        if (is_array($value)) {
            $count += countFormValues($value, $depth + 1);
        } else {
            $count++;
        }
    }
    return $count;
}
