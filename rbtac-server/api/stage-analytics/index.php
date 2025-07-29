<?php
require_once '../config/Database.php';
require_once '../config/headers.php';

class StageAnalyticsAPI {
    private $conn;

    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();
    }

    public function getStageAnalytics($programId, $stageId = null) {
        $whereClause = "WHERE ps.program_id = ?";
        $params = [$programId];

        if ($stageId) {
            $whereClause .= " AND ps.id = ?";
            $params[] = $stageId;
        }

        $query = "SELECT
                    ps.id as stage_id,
                    ps.title as stage_name,
                    ps.expected_duration_days,
                    COUNT(cps.company_id) as total_companies,
                    COUNT(CASE WHEN cps.is_current = 1 THEN 1 END) as active_companies,
                    COUNT(CASE WHEN cps.completed_at IS NOT NULL THEN 1 END) as completed_companies,
                    AVG(CASE
                        WHEN cps.completed_at IS NOT NULL
                        THEN DATEDIFF(cps.completed_at, cps.entered_at)
                        ELSE DATEDIFF(NOW(), cps.entered_at)
                    END) as avg_duration_days,
                    ROUND(
                        COUNT(CASE WHEN cps.completed_at IS NOT NULL THEN 1 END) * 100.0 /
                        NULLIF(COUNT(cps.company_id), 0), 2
                    ) as completion_rate
                 FROM program_stages ps
                 LEFT JOIN company_program_stages cps ON ps.id = cps.program_stage_id
                 $whereClause
                 GROUP BY ps.id, ps.title, ps.expected_duration_days
                 ORDER BY ps.stage_order";

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getBottleneckAnalysis($programId) {
        $query = "SELECT
                    ps.id,
                    ps.title,
                    ps.stage_order,
                    COUNT(cps.company_id) as companies_stuck,
                    AVG(DATEDIFF(NOW(), cps.entered_at)) as avg_days_stuck,
                    ps.expected_duration_days,
                    CASE
                        WHEN AVG(DATEDIFF(NOW(), cps.entered_at)) > ps.expected_duration_days * 1.5
                        THEN 'high'
                        WHEN AVG(DATEDIFF(NOW(), cps.entered_at)) > ps.expected_duration_days
                        THEN 'medium'
                        ELSE 'low'
                    END as bottleneck_severity
                 FROM program_stages ps
                 LEFT JOIN company_program_stages cps ON ps.id = cps.program_stage_id
                 WHERE ps.program_id = ? AND cps.is_current = 1 AND cps.completed_at IS NULL
                 GROUP BY ps.id, ps.title, ps.stage_order, ps.expected_duration_days
                 HAVING companies_stuck > 0
                 ORDER BY bottleneck_severity DESC, avg_days_stuck DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([$programId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProgressionTrends($programId, $days = 30) {
        $query = "SELECT
                    DATE(st.created_at) as date,
                    ps.title as stage_name,
                    COUNT(*) as transitions
                 FROM stage_transitions st
                 JOIN program_stages ps ON st.to_stage_id = ps.id
                 WHERE st.program_id = ?
                 AND st.created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
                 GROUP BY DATE(st.created_at), ps.id, ps.title
                 ORDER BY date DESC, ps.stage_order";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([$programId, $days]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getStagePerformanceMetrics($stageId) {
        $query = "SELECT
                    COUNT(*) as total_entries,
                    COUNT(CASE WHEN completed_at IS NOT NULL THEN 1 END) as completions,
                    AVG(CASE
                        WHEN completed_at IS NOT NULL
                        THEN DATEDIFF(completed_at, entered_at)
                        ELSE NULL
                    END) as avg_completion_days,
                    MIN(CASE
                        WHEN completed_at IS NOT NULL
                        THEN DATEDIFF(completed_at, entered_at)
                        ELSE NULL
                    END) as min_completion_days,
                    MAX(CASE
                        WHEN completed_at IS NOT NULL
                        THEN DATEDIFF(completed_at, entered_at)
                        ELSE NULL
                    END) as max_completion_days,
                    COUNT(CASE WHEN is_current = 1 THEN 1 END) as currently_active,
                    AVG(CASE
                        WHEN is_current = 1
                        THEN DATEDIFF(NOW(), entered_at)
                        ELSE NULL
                    END) as avg_current_duration
                 FROM company_program_stages
                 WHERE program_stage_id = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([$stageId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}

// Handle requests
$method = $_SERVER['REQUEST_METHOD'];
$api = new StageAnalyticsAPI();

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'analytics';
    $programId = $_GET['program_id'] ?? null;
    $stageId = $_GET['stage_id'] ?? null;

    if (!$programId) {
        http_response_code(400);
        echo json_encode(['error' => 'Program ID required']);
        exit;
    }

    switch ($action) {
        case 'analytics':
            $result = $api->getStageAnalytics($programId, $stageId);
            break;

        case 'bottlenecks':
            $result = $api->getBottleneckAnalysis($programId);
            break;

        case 'trends':
            $days = $_GET['days'] ?? 30;
            $result = $api->getProgressionTrends($programId, $days);
            break;

        case 'performance':
            if (!$stageId) {
                http_response_code(400);
                echo json_encode(['error' => 'Stage ID required for performance metrics']);
                exit;
            }
            $result = $api->getStagePerformanceMetrics($stageId);
            break;

        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            exit;
    }

    echo json_encode($result);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
