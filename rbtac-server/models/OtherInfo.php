<?php
class OtherInfo
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }



 public function importWalkins()
{
  $walkins = $this->loadJsonFile();
  $total = count($walkins);
  $success = 0;

  echo "Starting import of {$total} walk-in records...\n";

  foreach ($walkins as $index => $item) {
    // Defensive check: fallback if key is missing
    $companyName = $item['Company Name'] ?? 'Unknown Company';
    echo "Processing {$index}/{$total}: {$companyName}... ";

    try {
      $companyId = $this->saveCompany($item);

      if (!$companyId || !is_numeric($companyId)) {
        echo "❌ Skipped (company save failed or invalid ID)\n";
        echo "ℹ️ Company Name: {$companyName}\n";
        echo "Company ID: {$companyId}\n";
        continue;
      }

      $this->savePrimaryUser($item, $companyId);
      $this->saveReasons($companyId);
      $this->assignCompanyToProgram($companyId, 2); // Default program ID

      $success++;
      echo "✅ Imported successfully\n";
    } catch (Exception $e) {
      echo "❌ Error: " . $e->getMessage() . "\n";
    }
  }

  echo "✅ Import complete. Successfully imported {$success}/{$total} records.\n";
  return $success;
}


  // Save company information
  private function saveCompany($item, $dryRun = false)
  {
    $query = "INSERT INTO companies (
      name, trading_name, registration_no, annual_turnover, turnover_verified,
      address_line1, suburb, city, postal_code, types_of_address,
      sector, description, no_perm_employees, no_temp_employees,
      bbbee_level, bbbee_expiry_date, tax_pin_expiry_date,
      is_black_owned, is_black_women_owned, is_youth_owned,
      company_size, cipc_status, tax_pin_status, bbbee_status,
      visit_date, created_at, updated_at, status_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), 1)";

    $stmt = $this->conn->prepare($query);

    $result = $stmt->execute([
      $this->clean($item['Company Name']),
      $this->clean($item['Trading Name']),
      $this->clean($item['Company Registration No.']),
      $this->normalizeTurnover($item[' Company Turn-over ']),
      0,
      null, // address_line1
      null, // suburb
      $this->clean($item['Business Location']),
      null, // postal_code
      null, // types_of_address
      $this->clean($item['Business Sector']),
      $this->clean($item['Service offering or Goods']),
      0,
      0, // permanent/temp employees
      null, // bbbee_level
      $this->parseDate($item['BBBEE Expirey Date']),
      $this->parseDate($item['Tax pin Expirey Date']),
      $item['Black ownership'] === 'Yes' ? 1 : 0,
      $item['Black Women ownership'] === 'Yes' ? 1 : 0,
      $item['Youth'] === 'Yes' ? 1 : 0,
      $this->clean($item['Current size (EME?QSE)']),
      $this->clean($item['CIPC Status']),
      $this->clean($item['Valid Status']),
      $this->clean($item['Valid Status2']),
      null
    ]);

    return $result ? $this->conn->lastInsertId() : null;
  }
  private function normalizeTurnover($value)
  {
    $value = trim($value);
    $value = str_replace(['R', ',', ' '], '', $value);
    return $value ?: null;
  }

  // Save primary user (main director)
  private function savePrimaryUser($item, $companyId)
  {
    // Inferred race and gender
    $race = ($item['Black ownership'] ?? '') === 'Yes' ? 'Black' : null;
    $gender = ($item['Black Women ownership'] ?? '') === 'Yes' ? 'Female' : (($item['Black ownership'] ?? '') === 'Yes' ? 'Male' : null);

    $query = "INSERT INTO users (
      name, gender, race, email, cell, dob, id_number,
      company_id, is_primary, created_at, updated_at, status_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW(), 1)";

    $stmt = $this->conn->prepare($query);
    $stmt->execute([
      $item['Contact Person'] ?? '',
      $gender,
      $race,
      $item['Email Address'],
      $item['Contact Number'] ?? '',
      null,
      $item['Director ID Number'] ?? '',
      $companyId
    ]);
  }



  private function saveReasons($companyId)
  {
    $reasonId = 4; // Grant Funding
echo "ℹ️ℹ️ℹ️Assigning company ID {$companyId} to reason ID {$reasonId} (Grant Funding)...\n";
    // Check if already exists
    $checkQuery = "SELECT id FROM company_reasons
                 WHERE company_id = ? AND reason_id = ?";
    $checkStmt = $this->conn->prepare($checkQuery);
    $checkStmt->execute([$companyId, $reasonId]);

    if (!$checkStmt->fetch()) {
      $insertQuery = "INSERT INTO company_reasons (
        company_id, reason_id, created_at, updated_at, status_id
      ) VALUES (?, ?, NOW(), NOW(), 1)";
      $insertStmt = $this->conn->prepare($insertQuery);
      $insertStmt->execute([$companyId, $reasonId]);

      echo "✅ Company ID {$companyId} assigned to reason ID {$reasonId} (Grant Funding)\n";
    } else {
      echo "ℹ️ Company ID {$companyId} already assigned to reason ID {$reasonId}\n";
    }
  }



  // Helper to clean and normalize input strings
  private function clean($val)
  {
    return trim($val ?? '');
  }

  // Helper to parse various date formats
  private function parseDate($dateString)
  {
    if (empty($dateString)) return null;

    $formats = [
      'Y-m-d',
      'd/m/Y',
      'd.m.Y',
      'd-m-Y',
      'j F Y',     // e.g. 25 July 2025
      'j M Y',     // e.g. 25 Jul 2025
      'd F Y',     // e.g. 25 July 2025
      'd M Y',     // e.g. 25 Jul 2025
    ];

    foreach ($formats as $format) {
      $date = DateTime::createFromFormat($format, trim($dateString));
      if ($date && $date->format($format) === trim($dateString)) {
        return $date->format('Y-m-d H:i:s');
      }
    }

    // Final fallback: try strtotime
    try {
      $timestamp = strtotime($dateString);
      if ($timestamp) {
        return date('Y-m-d H:i:s', $timestamp);
      }
    } catch (Exception $e) {
      // Log failed parsing attempt with context
      $trace = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS, 2);
      $caller = isset($trace[1]) ? $trace[1]['function'] : 'unknown';
      error_log("Failed to parse date: '$dateString' in $caller()");
    }

    return null;
  }

  private function assignCompanyToProgram($companyId, $programId = 2)
  {
    $joinDate = '2025-05-01';

    // Skip if already assigned
    $check = $this->conn->prepare("SELECT id FROM company_programs WHERE company_id = ? AND program_id = ?");
    $check->execute([$companyId, $programId]);

    if ($check->fetch()) {
      echo "Already assigned to program {$programId}\n";
      return;
    }

    $insert = $this->conn->prepare("INSERT INTO company_programs (
    company_id, program_id, joined_at, created_at, updated_at, status_id
  ) VALUES (?, ?, ?, NOW(), NOW(), 1)");

    $insert->execute([$companyId, $programId, $joinDate]);

    echo "✅ Assigned company ID {$companyId} to program {$programId} (Join date: {$joinDate})\n";
  }


  public function loadJsonFile($filename = "granta-funding.json")
  {
    $filePath = __DIR__ . '/' . $filename;

    if (!file_exists($filePath)) {
      throw new Exception("JSON file not found: $filePath");
    }

    $json = file_get_contents($filePath);
    $data = json_decode($json, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
      throw new Exception("Invalid JSON: " . json_last_error_msg());
    }

    return $data;
  }
}
