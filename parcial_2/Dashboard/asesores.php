<?php
include 'components/sql.php';

// Habilitar la visualización de errores (solo para desarrollo)
ini_set('display_errors', 1);
error_reporting(E_ALL);

$asesores = [];

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
    $query = "SELECT ID, Nombre FROM asesor";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $asesores[] = [
                'ID' => $row['ID'],
                'Nombre' => $row['Nombre']
            ];
        }
    }
}

header('Content-Type: application/json');
echo json_encode($asesores);
?>
