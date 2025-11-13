<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";

$categoryId = $_GET["category_id"] ?? null;

try {
    if ($categoryId) {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE category_id = ? ORDER BY name");
        $stmt->execute([$categoryId]);
    } else {
        $stmt = $pdo->query("SELECT * FROM products ORDER BY name");
    }

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener productos"]);
}
