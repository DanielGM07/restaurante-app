<?php
header("Content-Type: application/json");
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$orderId = $data["order_id"] ?? null;
$status  = $data["status"] ?? null;

if (!$orderId || !$status) {
    http_response_code(400);
    echo json_encode(["error" => "Datos inválidos"]);
    exit;
}

$stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
$stmt->execute([$status, $orderId]);

echo json_encode(["message" => "Estado actualizado"]);
