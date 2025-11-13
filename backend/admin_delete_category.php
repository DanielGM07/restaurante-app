<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";
require "admin_auth.php";

$data = json_decode(file_get_contents("php://input"), true);

// Validar admin
$userId = $data["user_id"] ?? null;
requireAdmin($pdo, $userId);

$id = $data["id"] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "ID de categoría requerido"]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Categoría eliminada"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "No se pudo eliminar la categoría (puede tener productos asociados)"
    ]);
}
