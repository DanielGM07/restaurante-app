<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";
require "admin_auth.php";

// Validar admin usando user_id por query string
$userId = $_GET["user_id"] ?? null;
requireAdmin($pdo, $userId);

try {
    $sql = "SELECT
                p.id,
                p.name,
                p.description,
                p.price,
                p.stock,
                p.image_url,
                p.category_id,
                c.name AS category_name
            FROM products p
            JOIN categories c ON c.id = p.category_id
            ORDER BY c.name, p.name";

    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener productos"]);
}
