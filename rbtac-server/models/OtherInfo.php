<?php
class OtherInfo
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  // Get all walk-in records
  public function walkins()
  {
    $query = "SELECT * FROM other_info WHERE ItemType = ? ORDER BY CreateDate DESC";
    $stmt = $this->conn->prepare($query);
    $stmt->execute(['Walkins']);
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC) ?? [];

    $response = [];
    foreach ($items as &$item) {
      $val = json_decode($item['ItemValue'], true);
      $response[] = $val;
    }
    return $response;
  }

  // Main import method
  public function importWalkins()
  {
    $walkins = $this->walkins();
    $total = count($walkins);
    $success = 0;

    echo "Starting import of {$total} walk-in records...\n";

    foreach ($walkins as $index => $item) {
      echo "Processing {$index}/{$total}: {$item['CompanyName']}... ";

      try {
        $companyId = $this->saveCompany($item);
        if (!$companyId) {
          echo "Skipped (company save failed)\n";
          continue;
        }

        $this->savePrimaryUser($item, $companyId);
        $this->saveOtherUsers($item, $companyId);
        $this->saveDocuments($item, $companyId);
        $this->saveReasons($item, $companyId);

        $success++;
        echo "Imported successfully\n";
      } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
      }
    }

    echo "Import complete. Successfully imported {$success}/{$total} records.\n";
    return $success;
  }

  // Save company information
  private function saveCompany($item)
  {
    // Check for duplicates based on CompanyName + DirectorId
    $checkQuery = "SELECT id FROM companies
                  WHERE name = ? AND EXISTS (
                    SELECT 1 FROM users
                    WHERE company_id = companies.id
                    AND id_number = ?
                  )";
    $checkStmt = $this->conn->prepare($checkQuery);
    $checkStmt->execute([$item['CompanyName'], $item['DirectorId']]);

    if ($checkStmt->fetch()) {
      return null; // Skip duplicate
    }

    $query = "INSERT INTO companies (
        name, registration_no, annual_turnover, turnover_verified,
        address_line1, suburb, city, postal_code, types_of_address,
        sector, description, no_perm_employees, no_temp_employees,
        bbbee_level, bbbee_expiry_date, visit_date,
        created_at, updated_at, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)";

    $stmt = $this->conn->prepare($query);

    $result = $stmt->execute([
      $item['CompanyName'] ?? '',
      $item['CompanyRegistrationNo'] ?? '',
      $item['CompanyAnnualTurnover'] ?? '',
      !empty($item['CompanyAnnualTurnoverVerified']) ? 1 : 0,
      $item['AddressLine1'] ?? '',
      $item['Suburb'] ?? '',
      $item['City'] ?? '',
      $item['PostalCode'] ?? '',
      $item['TypesOfAddress'] ?? '',
      $item['Sector'] ?? '',
      $item['DescriptionOfBusiness'] ?? '',
      $item['NoOfPermanentEmployees'] ?? 0,
      $item['NoOfTemporaryEmployees'] ?? 0,
      $item['BBBEELevel'] ?? '',
      $item['BBBEEExpiryDate'] ?? null,
      $item['DateOfVisit'] ?? null
    ]);

    return $result ? $this->conn->lastInsertId() : null;
  }

  // Save primary user (main director)
  private function savePrimaryUser($item, $companyId)
  {
    $query = "INSERT INTO users (
        name, gender, race, email, cell, dob, id_number,
        company_id, is_primary, created_at, updated_at, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW(), 1)";

    $stmt = $this->conn->prepare($query);
    $stmt->execute([
      $item['NameAndSurname'] ?? '',
      $item['Gender'] ?? '',
      $item['Race'] ?? '',
      $item['EmailAddress'] ?? '',
      $item['ContactDetails'] ?? '',
      $this->parseDate($item['DateOfBirth']),
      $item['DirectorId'] ?? '',
      $companyId
    ]);
  }

  // Save other directors if they exist
  private function saveOtherUsers($item, $companyId)
  {
    if (empty($item['otherDirectors']) || !is_array($item['otherDirectors'])) return;

    $query = "INSERT INTO users (
        name, gender, race, email, cell, dob, id_number,
        company_id, is_primary, created_at, updated_at, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, NOW(), NOW(), 1)";
    $stmt = $this->conn->prepare($query);

    foreach ($item['otherDirectors'] as $director) {
      if (empty($director['name'])) continue; // Skip empty records

      $stmt->execute([
        $director['name'] ?? '',
        $director['gender'] ?? '',
        $director['race'] ?? '',
        $director['email'] ?? '',
        $director['cell'] ?? '',
        $this->parseDate($director['dob']),
        $director['idNo'] ?? '',
        $companyId
      ]);
    }
  }

  // Save all documents
  private function saveDocuments($item, $companyId)
  {
    if (empty($item['documents']) || !is_array($item['documents'])) return;

    $query = "INSERT INTO documents (
        company_id, name, url, date_uploaded,
        created_at, updated_at, status_id
      ) VALUES (?, ?, ?, ?, NOW(), NOW(), 1)";
    $stmt = $this->conn->prepare($query);

    foreach ($item['documents'] as $doc) {
      $stmt->execute([
        $companyId,
        $doc['name'] ?? '',
        $doc['url'] ?? '',
        $this->parseDate($doc['dateUploaded'])
      ]);
    }
  }

  // Save reasons for consultation
  private function saveReasons($item, $companyId)
  {
    $reasons = [];

    if (!empty($item['ReasonForConsultingESDCentre']))
      $reasons[] = trim($item['ReasonForConsultingESDCentre']);

    if (!empty($item['ReasonForConsultingESDCentre2']) &&
        $item['ReasonForConsultingESDCentre2'] !== $item['ReasonForConsultingESDCentre']) {
      $reasons[] = trim($item['ReasonForConsultingESDCentre2']);
    }

    foreach ($reasons as $reasonText) {
      if (empty($reasonText)) continue;

      $reasonId = $this->getOrCreateReason($reasonText);

      if ($reasonId) {
        // Check if this company-reason already exists
        $checkQuery = "SELECT id FROM company_reasons
                      WHERE company_id = ? AND reason_id = ?";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->execute([$companyId, $reasonId]);

        if (!$checkStmt->fetch()) {
          $query = "INSERT INTO company_reasons (
              company_id, reason_id, created_at, updated_at, status_id
            ) VALUES (?, ?, NOW(), NOW(), 1)";
          $stmt = $this->conn->prepare($query);
          $stmt->execute([$companyId, $reasonId]);
        }
      }
    }
  }

  // Helper to get or create a reason
  private function getOrCreateReason($reason)
  {
    $reason = trim($reason);
    if (empty($reason)) return null;

    $select = $this->conn->prepare("SELECT id FROM reasons WHERE reason = ?");
    $select->execute([$reason]);
    $existing = $select->fetch(PDO::FETCH_ASSOC);

    if ($existing) return $existing['id'];

    $insert = $this->conn->prepare("INSERT INTO reasons (reason, created_at, updated_at, status_id) VALUES (?, NOW(), NOW(), 1)");
    $insert->execute([$reason]);

    return $this->conn->lastInsertId();
  }

  // Helper to parse various date formats
  private function parseDate($dateString)
  {
    if (empty($dateString)) return null;

    try {
      $date = new DateTime($dateString);
      return $date->format('Y-m-d');
    } catch (Exception $e) {
      return null;
    }
  }
}
