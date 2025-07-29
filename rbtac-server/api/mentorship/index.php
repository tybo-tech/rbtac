<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'message' => 'Mentorship API',
    'version' => '1.0.0',
    'endpoints' => [
        'templates' => [
            'CREATE' => 'POST /api/mentorship/templates/create.php',
            'READ' => 'GET /api/mentorship/templates/read.php',
            'UPDATE' => 'PUT /api/mentorship/templates/update.php?id={id}',
            'parameters' => [
                'read' => 'id, search, category, details=true'
            ]
        ],
        'categories' => [
            'CREATE' => 'POST /api/mentorship/categories/create.php',
            'READ' => 'GET /api/mentorship/categories/read.php',
            'UPDATE' => 'PUT /api/mentorship/categories/update.php?id={id}',
            'REORDER' => 'POST /api/mentorship/categories/reorder.php?template_id={template_id}',
            'parameters' => [
                'read' => 'id, template_id, parent_id, hierarchical=true'
            ]
        ],
        'questions' => [
            'CREATE' => 'POST /api/mentorship/questions/create.php',
            'READ' => 'GET /api/mentorship/questions/read.php',
            'UPDATE' => 'PUT /api/mentorship/questions/update.php?id={id}',
            'REORDER' => 'POST /api/mentorship/questions/reorder.php?template_id={template_id}',
            'parameters' => [
                'read' => 'id, template_id, category_id, task_triggers=true'
            ]
        ],
        'sessions' => [
            'CREATE' => 'POST /api/mentorship/sessions/create.php',
            'READ' => 'GET /api/mentorship/sessions/read.php',
            'UPDATE' => 'PUT /api/mentorship/sessions/update.php?id={id}',
            'parameters' => [
                'read' => 'id, company_id, template_id, recent, limit, statistics, details=true'
            ]
        ],
        'responses' => [
            'UPSERT' => 'POST /api/mentorship/responses/upsert.php',
            'READ' => 'GET /api/mentorship/responses/read.php',
            'SAVE_MULTIPLE' => 'POST /api/mentorship/responses/save-multiple.php?session_id={session_id}',
            'parameters' => [
                'read' => 'id, session_id, statistics, question_id'
            ]
        ],
        'tasks' => [
            'CREATE' => 'POST /api/mentorship/tasks/create.php',
            'READ' => 'GET /api/mentorship/tasks/read.php',
            'UPDATE' => 'PUT /api/mentorship/tasks/update.php?id={id}',
            'UPDATE_STATUS' => 'PUT /api/mentorship/tasks/update-status.php?id={id}',
            'CREATE_FROM_TRIGGER' => 'POST /api/mentorship/tasks/create-from-trigger.php',
            'parameters' => [
                'read' => 'id, session_id, company_id, status, assigned_to, overdue, statistics, user_id'
            ]
        ]
    ],
    'data_types' => [
        'question_types' => ['text', 'textarea', 'number', 'boolean', 'dropdown', 'date'],
        'task_statuses' => ['pending', 'in_progress', 'done']
    ]
]);
?>
