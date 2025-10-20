<?php
session_start();
include '../src/conexion.php';
header('Content-Type: application/json');
//error_reporting(0);
/* if (!isset($_SESSION['login'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
} */
if (!isset($_GET['dni'])) {
    http_response_code(400);
    echo json_encode(['error' => 'DNI no proporcionado']);
    exit;
}

$horarioAsignado  = $_GET['dni'];
//$horarioAsignado = $_SESSION['login']; // contiene el valor de preceptor.usuario

$sql = "
SELECT a.id, a.dni, a.apellido, a.nombre, t.nombre_trayecto, d.nombre_dia, TIME_FORMAT(h.hora_inicio, '%H:%i') AS hora FROM asistencias a JOIN trayectos t ON a.id_trayecto = t.id_trayecto JOIN dias d ON a.id_dia = d.id_dia JOIN horas h ON a.id_hora = h.id_hora WHERE a.dni = :alumno;
";

$stmt = $conn->prepare($sql);
$stmt->bindParam(':alumno', $horarioAsignado);
$stmt->execute();

$datos = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $datos[] = [
        'id' => $row['id'],
        'alumno' => $row['apellido'] . ' ' . $row['nombre'],
        'dni' => $row['dni'],
        'curso' => $row['nombre_trayecto']. ' - ' . $row['nombre_dia'] . ' - ' . $row['hora']   ,
    ];
}
echo json_encode($datos);
?>