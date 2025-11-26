<?php
// backend/create_order.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Leer JSON que envía el frontend
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data || !isset($data['items']) || !is_array($data['items']) || count($data['items']) === 0) {
    http_response_code(400);
    echo json_encode(["error" => "Datos inválidos o items faltantes"]);
    exit;
}

// 2. Armar el payload para enviar al servidor Node
$payload = [
    "items" => $data['items'],
    // Podés usar algún identificador de pedido, por ahora algo simple:
    "external_reference" => "pedido-" . time()
];

// 3. Llamar al servidor Node (Mercado Pago) en http://localhost:4000/create-preference
$nodeUrl = "http://localhost:4000/create-preference";

$ch = curl_init($nodeUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($response === false || $httpCode >= 400) {
    curl_close($ch);
    http_response_code(500);
    echo json_encode(["error" => "Error al crear la preferencia en el servidor Node"]);
    exit;
}

curl_close($ch);

// 4. Devolver al frontend la respuesta de Node (init_point, id, etc.)
$mpData = json_decode($response, true);

if (!$mpData || !isset($mpData['init_point'])) {
    http_response_code(500);
    echo json_encode(["error" => "Respuesta inválida desde el servidor Node"]);
    exit;
}

echo json_encode([
    "init_point" => $mpData['init_point'],
    "preference_id" => $mpData['id'] ?? null
]);
