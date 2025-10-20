<?php
header('Content-Type: application/json');
session_start();
require '../src/conexion.php'; // $conn = new PDO(..., [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION])

try {
  // detectar payload
  $ct = $_SERVER['CONTENT_TYPE'] ?? '';
  $is_json = stripos($ct, 'application/json') !== false;
  $in = $is_json ? (json_decode(file_get_contents('php://input'), true) ?: []) : $_POST;

  // requeridos
  $req = ['nombre','apellido','dni','cel'];
  foreach ($req as $k) if (empty($in[$k])) throw new Exception("Falta $k");

  // opcionales
  $domicilio = $in['domicilio'] ?? null;
  $fnac = $in['fecha_nacimiento'] ?? null;
  $email = $in['email'] ?? null;
  $genero = $in['genero'] ?? null;
  $nac = $in['nacionalidad'] ?? null;
  $esc_formal = !empty($in['escuela_formal']) ? 1 : 0;
  $esc_gestion = $esc_formal ? ($in['escuela_gestion'] ?? null) : null;

  // helpers binarios
  $get_file = function($key) {
    if (!isset($_FILES[$key]) || $_FILES[$key]['error'] !== UPLOAD_ERR_OK) return [null,null];
    return [file_get_contents($_FILES[$key]['tmp_name']), $_FILES[$key]['type'] ?? null];
  };
  $read_b64 = function($b64){
    if (!$b64) return [null,null];
    if (preg_match('#^data:(.*?);base64,#', $b64, $m)) {
      $mime = $m[1]; $b64 = substr($b64, strpos($b64, ',')+1);
    } else $mime = null;
    return [base64_decode($b64), $mime];
  };

  // blobs según modo
  if ($is_json) {
    list($dni_frente,$dni_frente_mime) = $read_b64($in['dni_frente_b64'] ?? null);
    list($dni_dorso ,$dni_dorso_mime ) = $read_b64($in['dni_dorso_b64']  ?? null);
    list($perfil    ,$perfil_mime    ) = $read_b64($in['perfil_b64']     ?? null);
    list($partida   ,$partida_mime   ) = $read_b64($in['partida_b64']    ?? null);
  } else {
    list($dni_frente,$dni_frente_mime) = $get_file('dni_frente');
    list($dni_dorso ,$dni_dorso_mime ) = $get_file('dni_dorso');
    list($perfil    ,$perfil_mime    ) = $get_file('perfil');
    list($partida   ,$partida_mime   ) = $get_file('partida_nacimiento');
  }

  // DNI único
  $q = $conn->prepare("SELECT 1 FROM personas WHERE dni = ?");
  $q->execute([$in['dni']]);
  if ($q->fetch()) throw new Exception('DNI ya registrado');

  $conn->beginTransaction();

  // insertar fotos solo si hay al menos un archivo
  $id_fotos = null;
  if ($perfil || $dni_frente || $dni_dorso || $partida) {
    $sqlF = "INSERT INTO fotos
      (perfil,perfil_mime,dni_frente,dni_frente_mime,dni_dorso,dni_dorso_mime,partida_nacimiento,partida_nacimiento_mime)
      VALUES (?,?,?,?,?,?,?,?)";
    $stF = $conn->prepare($sqlF);
    $stF->bindParam(1,$perfil,PDO::PARAM_LOB);
    $stF->bindValue(2,$perfil_mime);
    $stF->bindParam(3,$dni_frente,PDO::PARAM_LOB);
    $stF->bindValue(4,$dni_frente_mime);
    $stF->bindParam(5,$dni_dorso,PDO::PARAM_LOB);
    $stF->bindValue(6,$dni_dorso_mime);
    $stF->bindParam(7,$partida,PDO::PARAM_LOB);
    $stF->bindValue(8,$partida_mime);
    $stF->execute();
    $id_fotos = (int)$conn->lastInsertId();
  }

  // insertar persona
  $sqlP = "INSERT INTO personas
    (nombre,apellido,dni,domicilio,fecha_nacimiento,telefono,email,genero,nacionalidad,
     activo,wpp_confirmado,escuela_formal,escuela_gestion,contra)
    VALUES (?,?,?,?,?,?,?,?,?,1,0,?,?,?)";
  $stP = $conn->prepare($sqlP);
  $stP->execute([
    $in['nombre'],$in['apellido'],$in['dni'],$domicilio,$fnac,$in['cel'],
    $email,$genero,$nac,$esc_formal,$esc_gestion,$in['dni']
  ]);
  $id_persona = (int)$conn->lastInsertId();

  $conn->commit();
  echo json_encode(['ok'=>true,'id_persona'=>$id_persona,'id_fotos'=>$id_fotos]);
} catch (Exception $e) {
  if ($conn->inTransaction()) $conn->rollBack();
  http_response_code(400);
  echo json_encode(['ok'=>false,'error'=>$e->getMessage()]);
}
?>