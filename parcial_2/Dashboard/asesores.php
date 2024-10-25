<?php
include 'components/sql.php';

// Deshabilitar la visualización de errores
ini_set('display_errors', 0);
error_reporting(0);

$asesores = [];

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    $query = "SELECT ID, Correo, Nombre FROM asesor";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // Separar el campo Nombre en Nombres y Apellidos
            $nombresApellidos = separarNombre($row['Nombre']);
            $asesores[] = [
                'ID' => $row['ID'],
                'Correo' => $row['Correo'],
                'Nombres' => $nombresApellidos['nombres'],
                'Apellidos' => $nombresApellidos['apellidos']
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($asesores);

// Función para separar Nombres y Apellidos
function separarNombre($nombreCompleto) {
    $partes = explode(' ', trim($nombreCompleto));

    if (count($partes) <= 2) {
        // Si solo hay dos partes, asumimos que es "Nombre Apellido"
        $nombres = $partes[0];
        $apellidos = isset($partes[1]) ? $partes[1] : '';
    } else {
        // Si hay más de dos partes, asumimos que los primeros dos son nombres y el resto apellidos
        $nombres = $partes[0] . ' ' . $partes[1];
        $apellidos = implode(' ', array_slice($partes, 2));
    }

    return ['nombres' => $nombres, 'apellidos' => $apellidos];
}
?>
