<?php
class Task extends QueryExecutor
{
  public function addTask($task)
  {
    $query = "INSERT INTO tasks (
            title, description, due_date, related_group, related_field,
            session_id, company_id, category_id, parent_id,
            is_open, is_done, is_archived,
            assigned_to, created_by, metadata
        ) VALUES (
            :title, :description, :due_date, :related_group, :related_field,
            :session_id, :company_id, :category_id, :parent_id,
            :is_open, :is_done, :is_archived,
            :assigned_to, :created_by, :metadata
        )";

    $params = [
      ':title' => $task->title,
      ':description' => $task->description,
      ':due_date' => $task->due_date,
      ':related_group' => $task->related_group,
      ':related_field' => $task->related_field,
      ':session_id' => $task->session_id,
      ':company_id' => $task->company_id,
      ':category_id' => $task->category_id,
      ':parent_id' => $task->parent_id,
      ':is_open' => 1,
      ':is_done' => 0,
      ':is_archived' => 0,
      ':assigned_to' => $task->assigned_to ?? null,
      ':created_by' => $task->created_by,
      ':metadata' => json_encode($task->metadata ?? []),
    ];

    $this->executeQuery($query, $params);
    return $this->_conn->lastInsertId();
  }

  public function getTaskById($taskId)
  {
    $query = "SELECT * FROM tasks WHERE id = :id";
    $params = [':id' => $taskId];

    $result = $this->executeQuery($query, $params);
    $task = $result->fetch(PDO::FETCH_ASSOC);
    if ($task) {
      $task['metadata'] = json_decode($task['metadata'], true);
    }
    return $task;
  }
  public function updateTask($task)
  {
    $query = "UPDATE tasks SET
            title = :title,
            description = :description,
            due_date = :due_date,
            related_group = :related_group,
            related_field = :related_field,
            session_id = :session_id,
            company_id = :company_id,
            category_id = :category_id,
            parent_id = :parent_id,
            is_open = :is_open,
            is_done = :is_done,
            is_archived = :is_archived,
            assigned_to = :assigned_to,
            metadata = :metadata
        WHERE id = :id";

    $params = [
      ':title' => $task->title,
      ':description' => $task->description,
      ':due_date' => $task->due_date,
      ':related_group' => $task->related_group,
      ':related_field' => $task->related_field,
      ':session_id' => $task->session_id,
      ':company_id' => $task->company_id,
      ':category_id' => $task->category_id,
      ':parent_id' => $task->parent_id,
      ':is_open' => $task->is_open,
      ':is_done' => $task->is_done,
      ':is_archived' => $task->is_archived,
      ':assigned_to' => $task->assigned_to ?? null,
      ':metadata' => json_encode($task->metadata ?? []),
      ':id' => $task->id,
    ];

    $this->executeQuery($query, $params);
  }
  //list all
  public function list($companyId = null)
  {
    $query = "SELECT * FROM tasks";
    $params = [];

    if ($companyId) {
      $query .= " WHERE company_id = :company_id";
      $params[':company_id'] = $companyId;
    }

    $result = $this->executeQuery($query, $params);
    $tasks = $result->fetchAll(PDO::FETCH_ASSOC);

    foreach ($tasks as &$task) {
      $task['metadata'] = json_decode($task['metadata'], true);
    }

    return $tasks;
  }
  //deleteTask
  public function deleteTask($taskId)
  {
    $query = "DELETE FROM tasks WHERE id = :id";
    $params = [':id' => $taskId];
    $this->executeQuery($query, $params);
  }
  public function assignUserToTask($taskId, $userId)
  {
    $query = "INSERT INTO user_tasks (task_id, user_id) VALUES (:task_id, :user_id)";
    $params = [':task_id' => $taskId, ':user_id' => $userId];
    $this->executeQuery($query, $params);
  }

  public function getUsersForTask($taskId)
  {
    $query = "SELECT user_id FROM user_tasks WHERE task_id = :task_id";
    $params = [':task_id' => $taskId];

    $result = $this->executeQuery($query, $params);
    return $result->fetchAll(PDO::FETCH_COLUMN);
  }

  // Optional: mark done, archive, etc.
  public function markTaskDone($taskId)
  {
    $query = "UPDATE tasks SET is_done = 1, is_open = 0 WHERE id = :id";
    $this->executeQuery($query, [':id' => $taskId]);
  }
}
