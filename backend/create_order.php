<?php
// backend/create_order.php

require "cors.php";
require "db.php";
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

// 1. Leer JSON que envía el frontend
$input = file_get_contents("php://input");
$data  = json_decode($input, true);

$userId = $data["user_id"] ?? null;
$items  = $data["items"] ?? null;

if (!$userId || !is_array($items) || count($items) === 0) {
    http_response_code(400);
    echo json_encode(["error" => "Datos de pedido inválidos"]);
    exit;
}

try {
    $pdo->beginTransaction();

    $total      = 0;
    $orderItems = [];
    $mpItems    = [];

    foreach ($items as $item) {
        $productId = isset($item["product_id"]) ? (int)$item["product_id"] : 0;
        $quantity  = isset($item["quantity"]) ? (int)$item["quantity"] : 0;

        if ($productId <= 0 || $quantity <= 0) {
            throw new Exception("Ítem de pedido inválido");
        }

        // Bloqueamos la fila del producto para evitar condiciones de carrera de stock
        $stmt = $pdo->prepare("SELECT id, name, price, stock FROM products WHERE id = ? FOR UPDATE");
        $stmt->execute([$productId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            throw new Exception("Producto no encontrado (ID $productId)");
        }

        $stockDisponible = (int)$product["stock"];
        if ($stockDisponible < $quantity) {
            throw new Exception("No hay stock suficiente de '{$product["name"]}'");
        }

        $price = (float)$product["price"];
        $total += $price * $quantity;

        $orderItems[] = [
            "product_id" => $productId,
            "quantity"   => $quantity,
            "price"      => $price
        ];

        $mpItems[] = [
            "title"       => $product["name"],
            "quantity"    => $quantity,
            "unit_price"  => $price,
            "currency_id" => "ARS"
        ];
    }

    // Crear la orden en la BD
    $stmt = $pdo->prepare("
        INSERT INTO orders (user_id, total, status, payment_method)
        VALUES (?, ?, 'pending', 'MERCADO_PAGO')
    ");
    $stmt->execute([$userId, $total]);
    $orderId = $pdo->lastInsertId();

    // Guardar los items y descontar stock
    foreach ($orderItems as $oi) {
        // order_items
        $stmt = $pdo->prepare("
            INSERT INTO order_items (order_id, product_id, quantity, price)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->execute([
            $orderId,
            $oi["product_id"],
            $oi["quantity"],
            $oi["price"]
        ]);

        // Descontar stock
        $stmt = $pdo->prepare("
            UPDATE products
               SET stock = stock - ?
             WHERE id = ?
        ");
        $stmt->execute([
            $oi["quantity"],
            $oi["product_id"]
        ]);
    }

    $pdo->commit();
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
    exit;
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["error" => "Error al generar la orden"]);
    exit;
}

// 2. Armar el payload para enviar al servidor Node
$payload = [
    "items"              => $mpItems,
    "external_reference" => "order-" . $orderId
];

// 3. Llamar al servidor Node (Mercado Pago) en http://localhost:4000/create-preference
$nodeUrl = "http://localhost:4000/create-preference";

$ch = curl_init($nodeUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($ch);

if ($response === false) {
    curl_close($ch);
    http_response_code(500);
    echo json_encode(["error" => "No se pudo conectar con el servidor de pagos"]);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode < 200 || $httpCode >= 300) {
    http_response_code(500);
    echo json_encode(["error" => "Error al crear preferencia de pago"]);
    exit;
}

// 4. Devolver al frontend la respuesta de Node (init_point, id, etc.)
$mpData = json_decode($response, true);

if (!$mpData || !isset($mpData["init_point"])) {
    http_response_code(500);
    echo json_encode(["error" => "Respuesta inválida desde el servidor de pagos"]);
    exit;
}

echo json_encode([
    "init_point"    => $mpData["init_point"],
    "preference_id" => $mpData["id"] ?? null,
    "order_id"      => $orderId
]);
