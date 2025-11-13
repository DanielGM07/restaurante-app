<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";

try {
    $stmt = $pdo->query("SELECT id, name FROM categories ORDER BY name");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener categorías"]);
}
