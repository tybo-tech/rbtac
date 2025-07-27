<?php
class OrdersImport
{
  private $conn;
  private $userId = 1; // default admin user

  public function __construct($db)
  {
    $this->conn = $db;
  }

  public function importOrders()
  {
    $orders = $this->loadJsonFile("orders.json");
    $total = count($orders);
    $success = 0;

    echo "Starting import of {$total} orders...\n";

    foreach ($orders as $index => $item) {
      $companyName = $this->clean($item['Company Name'] ?? '');
      $supplierName = $this->clean($item['Service Provider'] ?? '');
      $productTypeName = $this->clean($item['Purchase Type'] ?? '');
      $items = $this->clean($item['List of items'] ?? '');
      $amount = $this->normalizeAmount($item[' Amount '] ?? '0');
      $comment = $this->clean($item['Comment'] ?? '');
      $note = $this->clean($item['Column7'] ?? '');

      try {
        $companyId = $this->getCompanyIdByName($companyName);
        if (!$companyId) throw new Exception("Company not found: {$companyName}");

        $supplierId = $this->getOrCreateSupplier($supplierName);
        $productTypeId = $this->getOrCreateProductType($productTypeName);
        $productId = $this->getOrCreateProduct($items, $productTypeId);

        // Save order
        $orderId = $this->createCompanyOrder($companyId, $supplierId, $amount, $item, $comment, $note);

        // Save line item
        $this->createOrderProduct($orderId, $productId, 1, $amount); // quantity = 1 for now

        $success++;
        echo "✅ Imported order {$index}/{$total} for {$companyName}\n";
      } catch (Exception $e) {
        echo "❌ Error on record {$index}: " . $e->getMessage() . "\n";
      }
    }

    echo "✅ Finished importing. Successfully processed {$success}/{$total} orders.\n";
  }

  private function getCompanyIdByName($name)
  {
    $stmt = $this->conn->prepare("SELECT id FROM companies WHERE name = ?");
    $stmt->execute([$name]);
    $row = $stmt->fetch();
    return $row['id'] ?? null;
  }

  private function getOrCreateSupplier($name)
  {
    $stmt = $this->conn->prepare("SELECT id FROM suppliers WHERE name = ?");
    $stmt->execute([$name]);
    if ($row = $stmt->fetch()) return $row['id'];

    $insert = $this->conn->prepare("INSERT INTO suppliers (name, created_at, updated_at, created_by, updated_by, status_id) VALUES (?, NOW(), NOW(), ?, ?, 1)");
    $insert->execute([$name, $this->userId, $this->userId]);
    return $this->conn->lastInsertId();
  }

  private function getOrCreateProductType($name)
  {
    $stmt = $this->conn->prepare("SELECT id FROM product_types WHERE name = ?");
    $stmt->execute([$name]);
    if ($row = $stmt->fetch()) return $row['id'];

    $insert = $this->conn->prepare("INSERT INTO product_types (name, created_at, updated_at, created_by, updated_by, status_id) VALUES (?, NOW(), NOW(), ?, ?, 1)");
    $insert->execute([$name, $this->userId, $this->userId]);
    return $this->conn->lastInsertId();
  }

  private function getOrCreateProduct($items, $typeId)
  {
    $isHamper = str_contains($items, ',') ? 1 : 0;

    $stmt = $this->conn->prepare("SELECT id FROM products WHERE name = ?");
    $stmt->execute([$items]);
    if ($row = $stmt->fetch()) return $row['id'];

    $insert = $this->conn->prepare("INSERT INTO products (name, product_type_id, is_hamper, created_at, updated_at, created_by, updated_by, status_id) VALUES (?, ?, ?, NOW(), NOW(), ?, ?, 1)");
    $insert->execute([$items, $typeId, $isHamper, $this->userId, $this->userId]);
    return $this->conn->lastInsertId();
  }

  private function createCompanyOrder($companyId, $supplierId, $amount, $item, $comment, $note)
  {
    $insert = $this->conn->prepare("
      INSERT INTO company_orders (
        company_id, supplier_id, total_amount,
        purchase_order, invoice_received, invoice_type,
        items_received, quotes_match, comment, note,
        created_at, updated_at, created_by, updated_by, status_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 1)
    ");

    $insert->execute([
      $companyId,
      $supplierId,
      $amount,
      $this->toBool($item[' Purchase Order '] ?? 'No'),
      $this->toBool($item['Invoice Received'] ?? 'No'),
      $this->clean($item[' Type of invoice in file '] ?? ''),
      $this->toBool($item[' Items Received '] ?? 'No'),
      $this->toBool($item[' Quotes align to presntation '] ?? 'No'),
      $comment,
      $note,
      $this->userId,
      $this->userId
    ]);

    return $this->conn->lastInsertId();
  }

  private function createOrderProduct($orderId, $productId, $quantity, $amount)
  {
    $insert = $this->conn->prepare("
      INSERT INTO company_order_products (
        company_order_id, product_id, quantity, unit_price, subtotal,
        created_at, updated_at, created_by, updated_by, status_id
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, 1)
    ");

    $insert->execute([
      $orderId,
      $productId,
      $quantity,
      $amount,
      $quantity * $amount,
      $this->userId,
      $this->userId
    ]);
  }

  private function normalizeAmount($val)
  {
    $val = str_replace(['R', ' ', ',', ' '], '', trim($val)); // includes weird space
    return is_numeric($val) ? (float)$val : 0;
  }

  private function toBool($val)
  {
    return strtolower(trim($val)) === 'yes' ? 1 : 0;
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
