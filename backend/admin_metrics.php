<?php
header("Content-Type: application/json");
require "cors.php";
require "db.php";
require "admin_auth.php";

// Validar admin
$userId = $_GET["user_id"] ?? null;
requireAdmin($pdo, $userId);

try {
    // === 1) RESUMEN GENERAL (TODAS LAS ÓRDENES) ===
    $stmt = $pdo->query("
        SELECT 
            COUNT(*) AS total_orders,
            COALESCE(SUM(total), 0) AS total_amount
        FROM orders
    ");
    $summaryRow = $stmt->fetch(PDO::FETCH_ASSOC);

    $totalOrders = (int)($summaryRow["total_orders"] ?? 0);
    $totalAmount = (float)($summaryRow["total_amount"] ?? 0);

    // Ítems vendidos en total (todas las órdenes)
    $stmt = $pdo->query("
        SELECT COALESCE(SUM(oi.quantity), 0) AS total_items
        FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
    ");
    $itemsRow = $stmt->fetch(PDO::FETCH_ASSOC);
    $totalItems = (int)($itemsRow["total_items"] ?? 0);

    // Ticket promedio (si hay al menos 1 orden)
    $avgTicket = $totalOrders > 0 ? $totalAmount / $totalOrders : 0.0;

    // === 2) MÉTODOS DE PAGO (TODAS LAS ÓRDENES) ===
    $stmt = $pdo->query("
        SELECT 
            COALESCE(payment_method, 'DESCONOCIDO') AS payment_method,
            COUNT(*) AS count
        FROM orders
        GROUP BY COALESCE(payment_method, 'DESCONOCIDO')
        ORDER BY count DESC
    ");
    $paymentMethods = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // === 3) PRODUCTOS MÁS VENDIDOS (TODAS LAS ÓRDENES) ===
    $stmt = $pdo->query("
        SELECT 
            p.id,
            p.name,
            SUM(oi.quantity) AS units_sold,
            SUM(oi.quantity * oi.price) AS total_revenue
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        JOIN orders o ON o.id = oi.order_id
        GROUP BY p.id, p.name
        HAVING units_sold > 0
        ORDER BY units_sold DESC
        LIMIT 10
    ");
    $topProducts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // === 4) VENTAS POR CATEGORÍA (TODAS LAS ÓRDENES) ===
    $stmt = $pdo->query("
        SELECT 
            c.id AS category_id,
            c.name AS category_name,
            COALESCE(SUM(oi.quantity * oi.price), 0) AS total_revenue
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        LEFT JOIN order_items oi ON oi.product_id = p.id
        LEFT JOIN orders o ON o.id = oi.order_id
        GROUP BY c.id, c.name
        ORDER BY total_revenue DESC, c.name ASC
    ");
    $salesByCategory = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "summary" => [
            "total_orders" => $totalOrders,
            "total_amount" => $totalAmount,
            "total_items"  => $totalItems,
            "avg_ticket"   => $avgTicket,
        ],
        "payment_methods"   => $paymentMethods,
        "top_products"      => $topProducts,
        "sales_by_category" => $salesByCategory,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error al obtener métricas"]);
}
