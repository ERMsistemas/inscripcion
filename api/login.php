<?php
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', '1');
session_start();
include '../src/conexion.php'; // Asegurate que $conn sea un objeto PDO

header('Content-Type: application/json');

// Obtener JSON de la petición
$input = json_decode(file_get_contents('php://input'), true);

$usuario = $input['usr'] ?? '';
$contra = $input['contra'] ?? '';

// Consulta segura con parámetros
$sql = "SELECT * FROM personas WHERE dni = :usuario and contra = :contra";
echo $sql;
$stmt = $conn->prepare($sql);
$stmt->bindParam(':usuario', $usuario);
$stmt->bindParam(':contra', $contra);
$stmt->execute();

if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $_SESSION['login'] = $row['dni'];
/*     $_SESSION['usr'] = $row['idlogin'];
    $_SESSION['login'] = $row['idlogin'];
 */
    echo json_encode([
        'success' => true,
        'user' => [ 'dni' => $row['dni']]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['success' => false]);
}

?>