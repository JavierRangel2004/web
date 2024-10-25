<?php
header('Content-Type: application/json; charset=utf-8');
include 'components/sql.php';

// Deshabilitar la visualización de errores
ini_set('display_errors', 0);
error_reporting(0);

// Obtener los datos de la solicitud
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Asegurarse de que $data es un array
if (!is_array($data)) {
    $data = [];
}

$fechaInicio = isset($data['fechaInicio']) ? $data['fechaInicio'] : null;
$fechaFin = isset($data['fechaFin']) ? $data['fechaFin'] : null;
$asesores = isset($data['asesores']) ? $data['asesores'] : []; // Array de IDs de asesores
$sedes = isset($data['sedes']) ? $data['sedes'] : []; // Array de IDs de sedes
$categorias = isset($data['categorias']) ? $data['categorias'] : []; // Array de IDs de categorías

// Inicializar variables
$results = [];
$summary = [
    'totalSesiones' => 0,
    'totalHorasProfesor' => '00:00',
    'duracionMediaSesion' => '00:00',
    'totalHorasTalent' => '00:00',
    'profesoresUnicos' => 0
];

// Construir la consulta con filtros
$query = "SELECT 
            asesoria.ID, 
            asesoria.Correo, 
            asesoria.Fecha, 
            asesoria.Duracion, 
            categoria.Nombre AS Categoria,
            GROUP_CONCAT(DISTINCT asesor.Nombre SEPARATOR ', ') AS Asesores
          FROM asesoria
          INNER JOIN categoria ON asesoria.id_Categoria = categoria.ID
          INNER JOIN asesoria_asesor ON asesoria.ID = asesoria_asesor.id_Asesoria
          INNER JOIN asesor ON asesoria_asesor.id_Asesor = asesor.ID
          INNER JOIN sedes ON asesoria.id_Sede = sedes.ID
          WHERE 1=1";

$params = [];
$types = '';

if (!empty($fechaInicio)) {
    $query .= " AND asesoria.Fecha >= ?";
    $params[] = $fechaInicio;
    $types .= 's';
}
if (!empty($fechaFin)) {
    $query .= " AND asesoria.Fecha <= ?";
    $params[] = $fechaFin;
    $types .= 's';
}
if (!empty($asesores)) {
    $placeholders = implode(',', array_fill(0, count($asesores), '?'));
    $query .= " AND asesor.ID IN ($placeholders)";
    $params = array_merge($params, $asesores);
    $types .= str_repeat('i', count($asesores));
}
if (!empty($sedes)) {
    $placeholders = implode(',', array_fill(0, count($sedes), '?'));
    $query .= " AND sedes.ID IN ($placeholders)";
    $params = array_merge($params, $sedes);
    $types .= str_repeat('i', count($sedes));
}
if (!empty($categorias)) {
    $placeholders = implode(',', array_fill(0, count($categorias), '?'));
    $query .= " AND categoria.ID IN ($placeholders)";
    $params = array_merge($params, $categorias);
    $types .= str_repeat('i', count($categorias));
}

$query .= " GROUP BY asesoria.ID";

$stmt = $conn->prepare($query);

if (!$stmt) {
    // Manejo de errores en la consulta
    echo json_encode(['error' => $conn->error]);
    exit;
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$duraciones = [];
$asesoresUnicos = [];
while ($row = $result->fetch_assoc()) {
    $results[] = $row;
    $summary['totalSesiones']++;
    $duraciones[] = $row['Duracion'];
    $asesoresEnAsesoria = explode(', ', $row['Asesores']);
    foreach ($asesoresEnAsesoria as $asesor) {
        $asesoresUnicos[$asesor] = true;
    }
}

// Calcular total de horas
$totalMinutes = array_sum($duraciones);
$hours = floor($totalMinutes / 60);
$minutes = $totalMinutes % 60;
$summary['totalHorasProfesor'] = sprintf("%02d:%02d", $hours, $minutes);

// Calcular duración media de sesión
if ($summary['totalSesiones'] > 0) {
    $averageMinutes = $totalMinutes / $summary['totalSesiones'];
    $avgHours = floor($averageMinutes / 60);
    $avgMinutes = round($averageMinutes % 60);
    $summary['duracionMediaSesion'] = sprintf("%02d:%02d", $avgHours, $avgMinutes);
}

// Asumiendo que las horas de Talent son las mismas
$summary['totalHorasTalent'] = $summary['totalHorasProfesor'];

// Contar profesores únicos
$summary['profesoresUnicos'] = count($asesoresUnicos);

$stmt->close();
$conn->close();

// Devolver los datos
echo json_encode(['summary' => $summary, 'results' => $results]);
?>
