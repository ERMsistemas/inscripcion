<?php
header('Content-Type: application/json');
session_start();
include '../src/conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

$dni = $data['dni'] ?? null;
$id_dia = $data['id_dia'] ?? null;
$id_hora = $data['id_hora'] ?? null;

if (!$dni || !$id_dia || !$id_hora) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Faltan datos']);
    exit;
}

try {
    $stmt = $conn->prepare("
        UPDATE asistencias
        SET id_dia = :id_dia, id_hora = :id_hora, confirmo = CURDATE()
        WHERE dni = :dni
    ");
    $stmt->execute([
        ':id_dia' => $id_dia,
        ':id_hora' => $id_hora,
        ':dni' => $dni
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>