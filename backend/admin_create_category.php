<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";
require "admin_auth.php";

$data = json_decode(file_get_contents("php://input"), true);

// Validar admin
$userId = $data["user_id"] ?? null;
requireAdmin($pdo, $userId);

$name = trim($data["name"] ?? "");

if (!$name) {
    http_response_code(400);
    echo json_encode(["error" => "Nombre de categoría obligatorio"]);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO categories (name) VALUES (?)");
    $stmt->execute([$name]);
    $newId = $pdo->lastInsertId();

    echo json_encode([
        "message" => "Categoría creada",
        "id" => $newId
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al crear la categoría"]);
}
