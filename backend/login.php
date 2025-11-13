<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Email y contraseña son obligatorios"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user["password_hash"])) {
        http_response_code(401);
        echo json_encode(["error" => "Credenciales inválidas"]);
        exit;
    }

    unset($user["password_hash"]);

    echo json_encode([
        "message" => "Login correcto",
        "user" => $user
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error en el servidor"]);
}
