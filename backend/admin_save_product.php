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
$name = trim($data["name"] ?? "");
$description = trim($data["description"] ?? "");
$price = $data["price"] ?? null;
$categoryId = $data["category_id"] ?? null;

if (!$name || !$price || !$categoryId) {
    http_response_code(400);
    echo json_encode(["error" => "Nombre, precio y categoría son obligatorios"]);
    exit;
}

try {
    if ($id) {
        // actualizar
        $stmt = $pdo->prepare(
            "UPDATE products
             SET name = ?, description = ?, price = ?, category_id = ?
             WHERE id = ?"
        );
        $stmt->execute([$name, $description, $price, $categoryId, $id]);
        echo json_encode(["message" => "Producto actualizado"]);
    } else {
        // crear
        $stmt = $pdo->prepare(
            "INSERT INTO products (name, description, price, category_id)
             VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([$name, $description, $price, $categoryId]);
        $newId = $pdo->lastInsertId();
        echo json_encode([
            "message" => "Producto creado",
            "id" => $newId
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al guardar el producto"]);
}
