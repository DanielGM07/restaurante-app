<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";
require "admin_auth.php";

$data = json_decode(file_get_contents("php://input"), true);

// Validar admin
$userId = $data["user_id"] ?? null;
requireAdmin($pdo, $userId);

$id          = $data["id"] ?? null;
$name        = trim($data["name"] ?? "");
$description = trim($data["description"] ?? "");
$price       = isset($data["price"]) ? (float)$data["price"] : null;
$categoryId  = $data["category_id"] ?? null;
$stock       = isset($data["stock"]) ? (int)$data["stock"] : 0;
$imageUrl    = trim($data["image_url"] ?? "");

if ($name === "" || $price === null || $categoryId === null) {
    http_response_code(400);
    echo json_encode(["error" => "Nombre, precio y categoría son obligatorios"]);
    exit;
}

if ($stock < 0) {
    http_response_code(400);
    echo json_encode(["error" => "El stock no puede ser negativo"]);
    exit;
}

try {
    if ($id) {
        // UPDATE
        $stmt = $pdo->prepare("
            UPDATE products
               SET name = ?,
                   description = ?,
                   price = ?,
                   stock = ?,
                   image_url = ?,
                   category_id = ?
             WHERE id = ?
        ");
        $stmt->execute([
            $name,
            $description !== "" ? $description : null,
            $price,
            $stock,
            $imageUrl !== "" ? $imageUrl : null,
            $categoryId,
            $id
        ]);

        echo json_encode(["message" => "Producto actualizado"]);
    } else {
        // INSERT
        $stmt = $pdo->prepare("
            INSERT INTO products (category_id, name, description, price, stock, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $categoryId,
            $name,
            $description !== "" ? $description : null,
            $price,
            $stock,
            $imageUrl !== "" ? $imageUrl : null
        ]);

        $newId = $pdo->lastInsertId();
        echo json_encode([
            "message" => "Producto creado",
            "id"      => $newId
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al guardar el producto"]);
}
