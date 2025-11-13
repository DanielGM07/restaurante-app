<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$userId = $data["user_id"] ?? null;
$items  = $data["items"] ?? [];

if (!$userId || !$items) {
    http_response_code(400);
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $total = 0;
    foreach ($items as $item) {
        $total += $item["price"] * $item["quantity"];
    }

    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
    $stmt->execute([$userId, $total]);

    $orderId = $pdo->lastInsertId();

    $stmtItem = $pdo->prepare(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
    );

    foreach ($items as $item) {
        $stmtItem->execute([
            $orderId,
            $item["product_id"],
            $item["quantity"],
            $item["price"]
        ]);
    }

    $pdo->commit();

    echo json_encode([
        "message" => "Pedido creado correctamente",
        "order_id" => $orderId,
        "total" => $total
    ]);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error" => "Error al crear el pedido"]);
}
