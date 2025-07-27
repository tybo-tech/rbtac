<?php
class RevenueImport
{
  private $conn;
  private $userId = 1;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function importRevenue($filename = 'revenues.json')
  {
    $records = $this->loadJsonFile($filename);
    echo "Starting revenue import of " . count($records) . " companies...\n";
    $success = 0;

    foreach ($records as $index => $item) {
      $companyName = $this->clean($item['CompanyName'] ?? '');
      $companyId = $this->getCompanyIdByName($companyName);

      if (!$companyId) {
        echo "❌ Company not found: {$companyName}\n";
        continue;
      }

      $previousClosing = 0;

      foreach ($item as $key => $value) {
        if (in_array($key, ['CompanyName', ''])) continue;

        $value = $this->normalizeAmount($value);
        [$month, $year] = $this->parseMonthYear($key);
        if (!$month || !$year) continue;

        $openingBalance = $previousClosing;
        $closingBalance = $value;

        $this->insertRevenue($companyId, $month, $year, $value, $openingBalance, $closingBalance);
        $previousClosing = $value;
      }

      $success++;
      echo "✅ Imported revenues for {$companyName}\n";
    }

    echo "✅ Finished importing. Processed {$success}/" . count($records) . " companies.\n";
  }

  private function getCompanyIdByName($name)
  {
    $stmt = $this->conn->prepare("SELECT id FROM companies WHERE name = ? or trading_name = ?");
    $stmt->execute([$name, $name]);
    $row = $stmt->fetch();
    return $row['id'] ?? null;
  }

  private function insertRevenue($companyId, $month, $year, $amount, $opening, $closing)
  {
    $stmt = $this->conn->prepare("
      INSERT INTO company_revenues (
        company_id, month, year, revenue_amount,
        opening_balance, closing_balance,
        created_at, updated_at, created_by, updated_by, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 1)
    ");
    $stmt->execute([
      $companyId,
      $month,
      $year,
      $amount,
      $opening,
      $closing,
      $this->userId,
      $this->userId
    ]);
  }

private function parseMonthYear($label)
{
  $label = trim($label);

  // Handle known typo manually
  if (stripos($label, 'febraury') !== false) {
    return [2, 2025]; // February = 2
  }

  // Format: Jan-25 → [1, 2025]
  if (preg_match('/^([A-Za-z]{3})-(\d{2})$/', $label, $matches)) {
    $month = date('n', strtotime($matches[1] . " 1")); // returns numeric month
    $year = 2000 + (int)$matches[2];
    return [$month, $year];
  }

  // Format: October 2024 → [10, 2024]
  if (preg_match('/^([A-Za-z]+)\s+(\d{4})$/', $label, $matches)) {
    $month = date('n', strtotime($matches[1] . " 1")); // numeric month
    $year = (int)$matches[2];
    return [$month, $year];
  }

  return [null, null];
}


  private function normalizeAmount($val)
  {
    $val = str_replace(['R', ',', ' ', ' '], '', trim($val));
    return is_numeric($val) ? (float)$val : 0;
  }

  private function clean($val)
  {
    return trim((string)($val ?? ''));
  }

  private function loadJsonFile($filename)
  {
    $path = __DIR__ . '/' . $filename;
    if (!file_exists($path)) throw new Exception("File not found: {$filename}");
    $json = file_get_contents($path);
    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) throw new Exception("Invalid JSON: " . json_last_error_msg());
    return $data;
  }
}
