<?php
class ProgramStage {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all stages for a specific program
    public function getByProgramId($program_id) {
        $query = "SELECT * FROM program_stages
                 WHERE program_id = ?
                 ORDER BY stage_order ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$program_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get all stages
    public function getAll() {
        $query = "SELECT ps.*, p.name as program_name
                 FROM program_stages ps
                 LEFT JOIN programs p ON ps.program_id = p.id
                 ORDER BY ps.program_id, ps.stage_order";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get stage by ID
    public function getById($id) {
        $query = "SELECT ps.*, p.name as program_name
                 FROM program_stages ps
                 LEFT JOIN programs p ON ps.program_id = p.id
                 WHERE ps.id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create new stage
    public function add($data) {
        try {
            // Get the next stage order for this program
            $orderQuery = "SELECT COALESCE(MAX(stage_order), 0) + 1 as next_order
                          FROM program_stages WHERE program_id = ?";
            $orderStmt = $this->conn->prepare($orderQuery);
            $orderStmt->execute([$data['program_id']]);
            $nextOrder = $orderStmt->fetch(PDO::FETCH_ASSOC)['next_order'];

            $query = "INSERT INTO program_stages
                     (program_id, title, description, stage_order)
                     VALUES (?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute([
                $data['program_id'],
                $data['title'],
                $data['description'] ?? null,
                $data['stage_order'] ?? $nextOrder
            ]);

            if ($result) {
                $id = $this->conn->lastInsertId();
                return $this->getById($id);
            }
            return false;
        } catch (Exception $e) {
            throw new Exception("Error creating program stage: " . $e->getMessage());
        }
    }

    // Update stage
    public function update($id, $data) {
        try {
            $query = "UPDATE program_stages
                     SET program_id = ?, title = ?, description = ?, stage_order = ?
                     WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute([
                $data['program_id'],
                $data['title'],
                $data['description'] ?? null,
                $data['stage_order'] ?? 1,
                $id
            ]);

            if ($result) {
                return $this->getById($id);
            }
            return false;
        } catch (Exception $e) {
            throw new Exception("Error updating program stage: " . $e->getMessage());
        }
    }

    // Delete stage
    public function remove($id) {
        try {
            // Check if stage is being used
            $checkQuery = "SELECT COUNT(*) as count FROM company_program_stages WHERE program_stage_id = ?";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->execute([$id]);
            $usage = $checkStmt->fetch(PDO::FETCH_ASSOC);

            if ($usage['count'] > 0) {
                throw new Exception("Cannot delete stage: it is currently being used by companies");
            }

            $query = "DELETE FROM program_stages WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            return $stmt->execute([$id]);
        } catch (Exception $e) {
            throw new Exception("Error deleting program stage: " . $e->getMessage());
        }
    }

    // Get next stage in sequence
    public function getNextStage($program_id, $current_stage_order) {
        $query = "SELECT * FROM program_stages
                 WHERE program_id = ? AND stage_order > ?
                 ORDER BY stage_order ASC LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$program_id, $current_stage_order]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get previous stage in sequence
    public function getPreviousStage($program_id, $current_stage_order) {
        $query = "SELECT * FROM program_stages
                 WHERE program_id = ? AND stage_order < ?
                 ORDER BY stage_order DESC LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$program_id, $current_stage_order]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
