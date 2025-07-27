<?php
class Company
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all companies
    public function getAll()
    {
        $query = "SELECT * FROM companies";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get company by ID
    public function getById($id)
    {
        $query = "SELECT * FROM companies WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Add a new company
    public function add($data)
    {
        $query = "";

        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute($data);
        return $success ? $this->getById($this->conn->lastInsertId()) : false;
    }

    // Update company
    public function update($id, $data)
    {
        $query = "UPDATE companies SET
            name = :name,
            registration_no = :registration_no,
            annual_turnover = :annual_turnover,
            turnover_verified = :turnover_verified,
            address_line1 = :address_line1,
            suburb = :suburb,
            city = :city,
            postal_code = :postal_code,
            types_of_address = :types_of_address,
            sector = :sector,
            description = :description,
            no_perm_employees = :no_perm_employees,
            no_temp_employees = :no_temp_employees,
            bbbee_level = :bbbee_level,
            bbbee_expiry_date = :bbbee_expiry_date,
            visit_date = :visit_date,
            updated_by = :updated_by,
            status_id = :status_id,
            trading_name = :trading_name,
            cipc_status = :cipc_status,
            is_black_owned = :is_black_owned,
            is_black_women_owned = :is_black_women_owned,
            is_youth_owned = :is_youth_owned,
            company_size = :company_size,
            tax_pin_expiry_date = :tax_pin_expiry_date,
            tax_pin_status = :tax_pin_status,
            bbbee_status = :bbbee_status
        WHERE id = :id";

        $data['id'] = $id;
        $stmt = $this->conn->prepare($query);
        $success = $stmt->execute($data);
        return $success ? $this->getById($id) : false;
    }

    // Delete company
    public function remove($id)
    {
        $query = "DELETE FROM companies WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}
?>
