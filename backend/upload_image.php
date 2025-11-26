<?php
require "cors.php";
header("Content-Type: application/json");

// Carpeta donde se van a guardar las imágenes (dentro de backend/)
$uploadDir = __DIR__ . "/uploads/";
$relativePath = "uploads/"; // ruta relativa vista desde el navegador (se concatena con API_URL en el frontend)

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isset($_FILES["file"])) {
    http_response_code(400);
    echo json_encode(["error" => "No se recibió ningún archivo"]);
    exit;
}

$file = $_FILES["file"];

if ($file["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["error" => "Error al subir el archivo"]);
    exit;
}

// Validar tipo MIME básico
$allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file["tmp_name"]);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(["error" => "Tipo de archivo no permitido"]);
    exit;
}

$extension = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));
if ($extension === "") {
    // fallback simple por MIME
    if ($mimeType === "image/jpeg") {
        $extension = "jpg";
    } elseif ($mimeType === "image/png") {
        $extension = "png";
    } elseif ($mimeType === "image/gif") {
        $extension = "gif";
    } elseif ($mimeType === "image/webp") {
        $extension = "webp";
    } else {
        $extension = "img";
    }
}

$filename = uniqid("img_", true) . "." . $extension;
$targetPath = $uploadDir . $filename;

if (!move_uploaded_file($file["tmp_name"], $targetPath)) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo guardar el archivo en el servidor"]);
    exit;
}

echo json_encode([
    "url" => $relativePath . $filename
]);
