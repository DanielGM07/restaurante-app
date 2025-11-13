<?php
// admin_auth.php

function requireAdmin(PDO $pdo, $userId)
{
    if (!$userId) {
        http_response_code(401);
        echo json_encode(["error" => "Usuario no autenticado"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || $user["role"] !== "ADMIN") {
        http_response_code(403);
        echo json_encode(["error" => "Acceso solo para administradores"]);
        exit;
    }
}
