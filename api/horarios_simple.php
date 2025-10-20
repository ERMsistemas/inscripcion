<?php
header('Content-Type: application/json');
include '../src/conexion.php';
session_start();

if (!isset($_SESSION['login'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autorizado']);
    exit;
}

$dni = $_GET['dni'] ?? null;
if (!$dni) {
    echo json_encode(['error' => 'Falta parámetro DNI']);
    exit;
}

try {
    // Obtener trayecto del alumno por su DNI
    $stmtTrayecto = $conn->prepare("
        SELECT DISTINCT t.nombre_trayecto
        FROM asistencias a
        JOIN trayectos t ON a.id_trayecto = t.id_trayecto
        WHERE a.dni = :dni
        LIMIT 1
    ");
    $stmtTrayecto->execute([':dni' => $dni]);
    $trayecto = $stmtTrayecto->fetchColumn();

    if (!$trayecto) {
        echo json_encode(['error' => 'Trayecto no encontrado']);
        exit;
    }

    // Obtener día, id_dia y horas asociadas
    /* $stmt = $conn->prepare("
        SELECT 
            d.id_dia,
            d.nombre_dia,
            h.id_hora,
            TIME_FORMAT(h.hora_inicio, '%H:%i') AS hora
        FROM trayectos t
        JOIN dia_hora dh ON t.id_trayecto = dh.id_trayecto
        JOIN dias d ON dh.id_dia = d.id_dia
        JOIN horas h ON dh.id_hora = h.id_hora
        WHERE t.nombre_trayecto = :trayecto
        ORDER BY d.id_dia, h.hora_inicio
    "); */
    $stmt = $conn->prepare("
            SELECT 
            d.id_dia,
            d.nombre_dia,
            h.id_hora,
            TIME_FORMAT(h.hora_inicio, '%H:%i') AS hora,
            COUNT(IF(a.confirmo IS NOT NULL, 1, NULL)) AS cantidad_alumnos
            FROM trayectos t
            JOIN dia_hora dh ON t.id_trayecto = dh.id_trayecto
            JOIN dias d ON dh.id_dia = d.id_dia
            JOIN horas h ON dh.id_hora = h.id_hora
            LEFT JOIN asistencias a 
            ON a.id_dia = d.id_dia 
            AND a.id_hora = h.id_hora 
            AND a.id_trayecto = t.id_trayecto
            WHERE t.nombre_trayecto = :trayecto
            GROUP BY d.id_dia, d.nombre_dia, h.id_hora, h.hora_inicio
            HAVING cantidad_alumnos < 25
            ORDER BY d.id_dia, h.hora_inicio;"
);
    $stmt->execute([':trayecto' => $trayecto]);
    $filas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $resultado = [];

    foreach ($filas as $fila) {
        $idDia = (int)$fila['id_dia'];

        if (!isset($resultado[$idDia])) {
            $resultado[$idDia] = [
                'id_dia' => (int)$idDia,
                'nombre_dia' => $fila['nombre_dia'],
                'horas' => []
            ];
        }

        $resultado[$idDia]['horas'][] = [
            'id_hora' => $fila['id_hora'],
            'hora' => $fila['hora']
        ];
    }

    // Reindexar como array plano
    echo json_encode(array_values($resultado), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    echo json_encode([
        'error' => 'Error de base de datos',
        'detalle' => $e->getMessage()
    ]);
}
