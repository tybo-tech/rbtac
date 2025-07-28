<?php
class CompanyRevenue
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all company revenues
    public function getAll()
    {
        $query = "SELECT cr.*, c.name as company_name
                  FROM company_revenues cr
                  LEFT JOIN companies c ON cr.company_id = c.id
                  ORDER BY cr.year DESC, cr.month DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get company revenue by ID
    public function getById($id)
    {
        $query = "SELECT cr.*, c.name as company_name
                  FROM company_revenues cr
                  LEFT JOIN companies c ON cr.company_id = c.id
                  WHERE cr.id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Get company revenues by company ID
    public function getByCompanyId($companyId)
    {
        $query = "SELECT cr.*, c.name as company_name
                  FROM company_revenues cr
                  LEFT JOIN companies c ON cr.company_id = c.id
                  WHERE cr.company_id = ?
                  ORDER BY cr.year DESC, cr.month DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$companyId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get company revenues by year
    public function getByYear($year)
    {
        $query = "SELECT cr.*, c.name as company_name
                  FROM company_revenues cr
                  LEFT JOIN companies c ON cr.company_id = c.id
                  WHERE cr.year = ?
                  ORDER BY cr.month DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$year]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get company revenues by company and year
    public function getByCompanyAndYear($companyId, $year)
    {
        $query = "SELECT cr.*, c.name as company_name
                  FROM company_revenues cr
                  LEFT JOIN companies c ON cr.company_id = c.id
                  WHERE cr.company_id = ? AND cr.year = ?
                  ORDER BY cr.month DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$companyId, $year]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Add a new company revenue record
    public function add($data)
    {
        $query = "INSERT INTO company_revenues (
                    company_id, revenue_amount, opening_balance, closing_balance,
                    month, year, created_by, updated_by, status_id
                  ) VALUES (
                    :company_id, :revenue_amount, :opening_balance, :closing_balance,
                    :month, :year, :created_by, :updated_by, :status_id
                  )";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([
            'company_id' => $data['company_id'],
            'revenue_amount' => $data['revenue_amount'] ?? 0.00,
            'opening_balance' => $data['opening_balance'] ?? 0.00,
            'closing_balance' => $data['closing_balance'] ?? 0.00,
            'month' => $data['month'],
            'year' => $data['year'],
            'created_by' => $data['created_by'] ?? null,
            'updated_by' => $data['updated_by'] ?? null,
            'status_id' => $data['status_id'] ?? 1,
        ]);
        return $success ? $this->getById($this->conn->lastInsertId()) : false;
    }

    // Update a company revenue record
    public function update($id, $data)
    {
        $query = "UPDATE company_revenues SET
                    company_id = :company_id,
                    revenue_amount = :revenue_amount,
                    opening_balance = :opening_balance,
                    closing_balance = :closing_balance,
                    month = :month,
                    year = :year,
                    updated_by = :updated_by,
                    status_id = :status_id
                  WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute([
            'id' => $id,
            'company_id' => $data['company_id'],
            'revenue_amount' => $data['revenue_amount'] ?? 0.00,
            'opening_balance' => $data['opening_balance'] ?? 0.00,
            'closing_balance' => $data['closing_balance'] ?? 0.00,
            'month' => $data['month'],
            'year' => $data['year'],
            'updated_by' => $data['updated_by'] ?? null,
            'status_id' => $data['status_id'] ?? 1,
        ]);
        return $success ? $this->getById($id) : false;
    }

    // Delete a company revenue record
    public function remove($id)
    {
        $query = "DELETE FROM company_revenues WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }

    // Get revenue summary for a company
    public function getRevenueSummary($companyId)
    {
        $query = "SELECT
                    year,
                    SUM(revenue_amount) as total_revenue,
                    AVG(revenue_amount) as avg_monthly_revenue,
                    COUNT(*) as months_recorded
                  FROM company_revenues
                  WHERE company_id = ?
                  GROUP BY year
                  ORDER BY year DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$companyId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get monthly revenue trend for a company
    public function getMonthlyTrend($companyId, $year)
    {
        $query = "SELECT
                    month,
                    revenue_amount,
                    opening_balance,
                    closing_balance,
                    (closing_balance - opening_balance) as net_change
                  FROM company_revenues
                  WHERE company_id = ? AND year = ?
                  ORDER BY month ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$companyId, $year]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
