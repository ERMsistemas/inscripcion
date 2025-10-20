<?php
header("Content-Security-Policy: frame-ancestors https://escueladeroboticamisiones.edu.ar/");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Permissions-Policy: autoplay=(self), fullscreen=(self), camera=*, microphone=*, display-capture=*, geolocation=*, magnetometer=*, accelerometer=*, gyroscope=*, payment=*, usb=*, midi=*, focus-without-user-activation=(self)");
date_default_timezone_set("America/Argentina/Buenos_Aires");

try {
    //$conn = new PDO("mysql:host=localhost;dbname=c2821298_erm;charset=utf8", "c2821298_erm", "do59GOtego");
    $conn = new PDO("mysql:host=localhost;dbname=c2821298_erm2025;charset=utf8", "root", "");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>