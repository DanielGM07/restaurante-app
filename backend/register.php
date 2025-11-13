<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!$name || !$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Todos los campos son obligatorios"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(["error" => "El email ya está registrado"]);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $passwordHash]);

    echo json_encode(["message" => "Usuario registrado correctamente"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor"]);
}
