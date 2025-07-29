<?php
class CompanyProgramStage {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all company stages
    public function getAll() {
        $query = "SELECT cps.*, c.name as company_name, p.name as program_name, ps.title as stage_title, ps.stage_order
                 FROM company_program_stages cps
                 LEFT JOIN companies c ON cps.company_id = c.id
                 LEFT JOIN programs p ON cps.program_id = p.id
                 LEFT JOIN program_stages ps ON cps.program_stage_id = ps.id
                 ORDER BY cps.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get stages by company and program
    public function getByCompanyAndProgram($company_id, $program_id) {
        $query = "SELECT cps.*, ps.title as stage_title, ps.stage_order, ps.description as stage_description
                 FROM company_program_stages cps
                 LEFT JOIN program_stages ps ON cps.program_stage_id = ps.id
                 WHERE cps.company_id = ? AND cps.program_id = ?
                 ORDER BY cps.entered_at ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$company_id, $program_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get current stage for company in program
    public function getCurrentStage($company_id, $program_id) {
        $query = "SELECT cps.*, ps.title as stage_title, ps.stage_order, ps.description as stage_description
                 FROM company_program_stages cps
                 LEFT JOIN program_stages ps ON cps.program_stage_id = ps.id
                 WHERE cps.company_id = ? AND cps.program_id = ? AND cps.is_current = 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$company_id, $program_id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get companies in a specific program with their current stages
    public function getCompaniesByProgram($program_id) {
        $query = "SELECT
                    c.id as company_id,
                    c.name as company_name,
                    c.sector,
                    cps.id as current_stage_record_id,
                    cps.program_stage_id as current_stage_id,
                    ps.title as current_stage_title,
                    ps.stage_order as current_stage_order,
                    cps.entered_at as stage_entered_at,
                    cps.completed_at as stage_completed_at,
                    cp.joined_at as program_joined_at
                 FROM company_programs cp
                 LEFT JOIN companies c ON cp.company_id = c.id
                 LEFT JOIN company_program_stages cps ON (cp.company_id = cps.company_id AND cp.program_id = cps.program_id AND cps.is_current = 1)
                 LEFT JOIN program_stages ps ON cps.program_stage_id = ps.id
                 WHERE cp.program_id = ? AND cp.status_id = 1
                 ORDER BY c.name ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$program_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get stage by ID
    public function getById($id) {
        $query = "SELECT cps.*, c.name as company_name, p.name as program_name, ps.title as stage_title, ps.stage_order
                 FROM company_program_stages cps
                 LEFT JOIN companies c ON cps.company_id = c.id
                 LEFT JOIN programs p ON cps.program_id = p.id
                 LEFT JOIN program_stages ps ON cps.program_stage_id = ps.id
                 WHERE cps.id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Move company to next stage
    public function advanceToNextStage($company_id, $program_id, $user_id = null) {
        try {
            $this->conn->beginTransaction();

            // Get current stage
            $currentStage = $this->getCurrentStage($company_id, $program_id);
            if (!$currentStage) {
                throw new Exception("Company is not currently in any stage of this program");
            }

            // Get next stage
            $nextStageQuery = "SELECT * FROM program_stages
                             WHERE program_id = ? AND stage_order > ?
                             ORDER BY stage_order ASC LIMIT 1";
            $nextStageStmt = $this->conn->prepare($nextStageQuery);
            $nextStageStmt->execute([$program_id, $currentStage['stage_order']]);
            $nextStage = $nextStageStmt->fetch(PDO::FETCH_ASSOC);

            if (!$nextStage) {
                throw new Exception("No next stage available for this program");
            }

            // Mark current stage as completed
            $completeQuery = "UPDATE company_program_stages
                            SET is_current = 0, completed_at = NOW()
                            WHERE id = ?";
            $completeStmt = $this->conn->prepare($completeQuery);
            $completeStmt->execute([$currentStage['id']]);

            // Create new stage record
            $newStageData = [
                'company_id' => $company_id,
                'program_id' => $program_id,
                'program_stage_id' => $nextStage['id']
            ];
            $newStageId = $this->add($newStageData);

            // Log the transition
            $this->logStageTransition($company_id, $program_id, $currentStage['program_stage_id'], $nextStage['id'], $user_id);

            $this->conn->commit();
            return $this->getById($newStageId);

        } catch (Exception $e) {
            $this->conn->rollBack();
            throw new Exception("Error advancing to next stage: " . $e->getMessage());
        }
    }

    // Move company to specific stage
    public function moveToStage($company_id, $program_id, $target_stage_id, $user_id = null) {
        try {
            $this->conn->beginTransaction();

            // Get current stage
            $currentStage = $this->getCurrentStage($company_id, $program_id);

            // Validate target stage exists and belongs to program
            $targetStageQuery = "SELECT * FROM program_stages WHERE id = ? AND program_id = ?";
            $targetStageStmt = $this->conn->prepare($targetStageQuery);
            $targetStageStmt->execute([$target_stage_id, $program_id]);
            $targetStage = $targetStageStmt->fetch(PDO::FETCH_ASSOC);

            if (!$targetStage) {
                throw new Exception("Target stage not found or doesn't belong to this program");
            }

            // Mark current stage as completed (if exists)
            if ($currentStage) {
                $completeQuery = "UPDATE company_program_stages
                                SET is_current = 0, completed_at = NOW()
                                WHERE id = ?";
                $completeStmt = $this->conn->prepare($completeQuery);
                $completeStmt->execute([$currentStage['id']]);
            }

            // Create new stage record
            $newStageData = [
                'company_id' => $company_id,
                'program_id' => $program_id,
                'program_stage_id' => $target_stage_id
            ];
            $newStageId = $this->add($newStageData);

            // Log the transition
            $fromStageId = $currentStage ? $currentStage['program_stage_id'] : null;
            $this->logStageTransition($company_id, $program_id, $fromStageId, $target_stage_id, $user_id);

            $this->conn->commit();
            return $this->getById($newStageId);

        } catch (Exception $e) {
            $this->conn->rollBack();
            throw new Exception("Error moving to stage: " . $e->getMessage());
        }
    }

    // Add new stage record
    public function add($data) {
        try {
            $query = "INSERT INTO company_program_stages
                     (company_id, program_id, program_stage_id, is_current)
                     VALUES (?, ?, ?, 1)";
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute([
                $data['company_id'],
                $data['program_id'],
                $data['program_stage_id']
            ]);

            if ($result) {
                return $this->conn->lastInsertId();
            }
            return false;
        } catch (Exception $e) {
            throw new Exception("Error creating company program stage: " . $e->getMessage());
        }
    }

    // Update stage record
    public function update($id, $data) {
        try {
            $query = "UPDATE company_program_stages
                     SET completed_at = ?, is_current = ?
                     WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute([
                $data['completed_at'] ?? null,
                $data['is_current'] ?? 1,
                $id
            ]);

            if ($result) {
                return $this->getById($id);
            }
            return false;
        } catch (Exception $e) {
            throw new Exception("Error updating company program stage: " . $e->getMessage());
        }
    }

    // Delete stage record
    public function remove($id) {
        try {
            $query = "DELETE FROM company_program_stages WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            return $stmt->execute([$id]);
        } catch (Exception $e) {
            throw new Exception("Error deleting company program stage: " . $e->getMessage());
        }
    }

    // Log stage transition to activity_logs
    private function logStageTransition($company_id, $program_id, $from_stage_id, $to_stage_id, $user_id = null) {
        try {
            // Get stage names for logging
            $fromStageName = null;
            $toStageName = null;

            if ($from_stage_id) {
                $fromQuery = "SELECT title FROM program_stages WHERE id = ?";
                $fromStmt = $this->conn->prepare($fromQuery);
                $fromStmt->execute([$from_stage_id]);
                $fromResult = $fromStmt->fetch(PDO::FETCH_ASSOC);
                $fromStageName = $fromResult ? $fromResult['title'] : 'Unknown';
            }

            if ($to_stage_id) {
                $toQuery = "SELECT title FROM program_stages WHERE id = ?";
                $toStmt = $this->conn->prepare($toQuery);
                $toStmt->execute([$to_stage_id]);
                $toResult = $toStmt->fetch(PDO::FETCH_ASSOC);
                $toStageName = $toResult ? $toResult['title'] : 'Unknown';
            }

            $action = $fromStageName
                ? "Stage transition: {$fromStageName} → {$toStageName}"
                : "Entered stage: {$toStageName}";

            $logQuery = "INSERT INTO activity_logs (user_id, action, reference_table, reference_id)
                        VALUES (?, ?, 'companies', ?)";
            $logStmt = $this->conn->prepare($logQuery);
            $logStmt->execute([$user_id, $action, $company_id]);

        } catch (Exception $e) {
            // Log error but don't throw - stage transition should still succeed
            error_log("Error logging stage transition: " . $e->getMessage());
        }
    }

    // Get stage statistics for a program
    public function getStageStatistics($program_id) {
        $query = "SELECT
                    ps.id as stage_id,
                    ps.title as stage_title,
                    ps.stage_order,
                    COUNT(cps.id) as company_count,
                    COUNT(CASE WHEN cps.is_current = 1 THEN 1 END) as current_companies,
                    COUNT(CASE WHEN cps.completed_at IS NOT NULL THEN 1 END) as completed_companies
                 FROM program_stages ps
                 LEFT JOIN company_program_stages cps ON ps.id = cps.program_stage_id
                 WHERE ps.program_id = ?
                 GROUP BY ps.id, ps.title, ps.stage_order
                 ORDER BY ps.stage_order ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$program_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
