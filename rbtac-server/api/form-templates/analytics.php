<?php
include_once '../../config/Database.php';
include_once '../../models/FormTemplate.php';
include_once '../../models/FormSession.php';
include_once '../../models/FormAnswer.php';

$templateId = $_GET['template_id'] ?? null;
$type = $_GET['type'] ?? 'overview'; // 'overview', 'field_stats', 'completion'

if (!$templateId) {
    echo json_encode(["message" => "Template ID is required."]);
    exit;
}

try {
    $connection = new Database();
    $db = $connection->connect();

    $templateService = new FormTemplate($db);
    $sessionService = new FormSession($db);
    $answerService = new FormAnswer($db);

    $template = $templateService->getFormTemplateById($templateId);
    if (!$template) {
        echo json_encode(["message" => "Template not found."]);
        exit;
    }

    $analytics = [
        'template' => [
            'id' => $template['id'],
            'title' => $template['title'],
            'created_at' => $template['created_at']
        ]
    ];

    switch ($type) {
        case 'overview':
            $stats = $templateService->getTemplateStats($templateId);
            $analytics['stats'] = $stats;

            // Get recent sessions
            $recentSessions = $sessionService->list(null, $templateId);
            $analytics['recent_sessions'] = array_slice($recentSessions, 0, 10);
            break;

        case 'field_stats':
            // Analyze each field in the template
            $fieldAnalytics = [];

            foreach ($template['structure']['groups'] as $group) {
                foreach ($group['fields'] as $field) {
                    if ($field['type'] !== 'table') {
                        $fieldStats = $answerService->getFieldValueAnalytics(
                            $templateId,
                            $group['key'],
                            $field['key']
                        );

                        $fieldAnalytics[$group['key']][$field['key']] = [
                            'label' => $field['label'],
                            'type' => $field['type'],
                            'stats' => $fieldStats
                        ];

                        // Add numeric stats if applicable
                        if ($field['type'] === 'number') {
                            $numericStats = $answerService->getNumericFieldStats(
                                $templateId,
                                $group['key'],
                                $field['key']
                            );
                            $fieldAnalytics[$group['key']][$field['key']]['numeric_stats'] = $numericStats;
                        }
                    }
                }
            }

            $analytics['field_analytics'] = $fieldAnalytics;
            break;

        case 'completion':
            // Analyze completion rates
            $sessions = $sessionService->getSessionsByTemplate($templateId);
            $completionData = [];

            foreach ($sessions as $session) {
                $answers = $answerService->getAnswersBySession($session['id']);
                $answerCount = count($answers);

                // Calculate expected fields (rough estimate)
                $expectedFields = 0;
                foreach ($template['structure']['groups'] as $group) {
                    $expectedFields += count($group['fields']);
                }

                $completionRate = $expectedFields > 0 ? ($answerCount / $expectedFields) * 100 : 0;

                $completionData[] = [
                    'session_id' => $session['id'],
                    'company_id' => $session['company_id'],
                    'answers_count' => $answerCount,
                    'completion_rate' => round($completionRate, 2),
                    'last_updated' => $session['updated_at']
                ];
            }

            $analytics['completion_data'] = $completionData;
            $analytics['average_completion'] = count($completionData) > 0
                ? round(array_sum(array_column($completionData, 'completion_rate')) / count($completionData), 2)
                : 0;
            break;

        default:
            echo json_encode(["message" => "Invalid analytics type. Use: overview, field_stats, or completion"]);
            exit;
    }

    echo json_encode($analytics);

} catch (Exception $e) {
    echo json_encode(["message" => "Error: " . $e->getMessage()]);
}
