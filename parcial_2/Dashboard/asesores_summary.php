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
$asesoresFilter = isset($data['asesores']) ? $data['asesores'] : [];
$sedes = isset($data['sedes']) ? $data['sedes'] : [];
$categorias = isset($data['categorias']) ? $data['categorias'] : [];

// Inicializar variables
$asesoresData = [];
$totalHorasProfesorMinutos = 0;
$totalHorasTalentMinutos = 0;

// Construir la consulta para obtener los totales
$totalQuery = "
    SELECT 
        SUM(asesoria.Duracion) AS TotalHoras
    FROM 
        asesoria
    JOIN 
        asesoria_asesor ON asesoria.ID = asesoria_asesor.id_Asesoria
    JOIN 
        asesor ON asesoria_asesor.id_Asesor = asesor.ID
    JOIN 
        categoria ON asesoria.id_Categoria = categoria.ID
    JOIN 
        sedes ON asesoria.id_Sede = sedes.ID
    WHERE 
        1=1
";

// Inicializar parámetros
$params = [];
$types = '';

// Aplicar filtros
if (!empty($fechaInicio)) {
    $totalQuery .= " AND asesoria.Fecha >= ?";
    $params[] = $fechaInicio;
    $types .= 's';
}
if (!empty($fechaFin)) {
    $totalQuery .= " AND asesoria.Fecha <= ?";
    $params[] = $fechaFin;
    $types .= 's';
}
if (!empty($asesoresFilter)) {
    $placeholders = implode(',', array_fill(0, count($asesoresFilter), '?'));
    $totalQuery .= " AND asesor.ID IN ($placeholders)";
    $params = array_merge($params, $asesoresFilter);
    $types .= str_repeat('i', count($asesoresFilter));
}
if (!empty($sedes)) {
    $placeholders = implode(',', array_fill(0, count($sedes), '?'));
    $totalQuery .= " AND sedes.ID IN ($placeholders)";
    $params = array_merge($params, $sedes);
    $types .= str_repeat('i', count($sedes));
}
if (!empty($categorias)) {
    $placeholders = implode(',', array_fill(0, count($categorias), '?'));
    $totalQuery .= " AND categoria.ID IN ($placeholders)";
    $params = array_merge($params, $categorias);
    $types .= str_repeat('i', count($categorias));
}

// Preparar y ejecutar la consulta para totales
$stmtTotal = $conn->prepare($totalQuery);

if (!$stmtTotal) {
    echo json_encode(['error' => $conn->error]);
    exit;
}

if (!empty($params)) {
    $stmtTotal->bind_param($types, ...$params);
}

$stmtTotal->execute();
$resultTotal = $stmtTotal->get_result();

if ($rowTotal = $resultTotal->fetch_assoc()) {
    $totalHorasProfesorMinutos = $rowTotal['TotalHoras'];
    $totalHorasTalentMinutos = $rowTotal['TotalHoras'];
}

$stmtTotal->close();

// Construir la consulta para obtener datos por asesor
$query = "
    SELECT 
        asesor.Correo,
        asesor.Nombre,
        SUM(asesoria.Duracion) AS TotalHorasTalent,
        COUNT(DISTINCT asesoria.ID) AS Sesiones,
        (SUM(asesoria.Duracion) / COUNT(DISTINCT asesoria.ID)) AS DuracionMediaSesion
    FROM 
        asesoria
    JOIN 
        asesoria_asesor ON asesoria.ID = asesoria_asesor.id_Asesoria
    JOIN 
        asesor ON asesoria_asesor.id_Asesor = asesor.ID
    JOIN 
        categoria ON asesoria.id_Categoria = categoria.ID
    JOIN 
        sedes ON asesoria.id_Sede = sedes.ID
    WHERE 
        1=1
";

// Reiniciar parámetros
$params = [];
$types = '';

// Aplicar filtros
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
if (!empty($asesoresFilter)) {
    $placeholders = implode(',', array_fill(0, count($asesoresFilter), '?'));
    $query .= " AND asesor.ID IN ($placeholders)";
    $params = array_merge($params, $asesoresFilter);
    $types .= str_repeat('i', count($asesoresFilter));
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

// Agrupar por asesor
$query .= " GROUP BY asesor.ID";

$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(['error' => $conn->error]);
    exit;
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $totalHorasAsesorMinutos = $row['TotalHorasTalent'];
    // Formatear las horas a "HH:MM"
    $totalHorasTalent = floor($row['TotalHorasTalent'] / 60) . ':' . str_pad($row['TotalHorasTalent'] % 60, 2, '0', STR_PAD_LEFT);
    $duracionMediaSesion = floor($row['DuracionMediaSesion'] / 60) . ':' . str_pad(round($row['DuracionMediaSesion'] % 60), 2, '0', STR_PAD_LEFT);

    // Calcular porcentajes
    $porcentajeHorasProf = $totalHorasProfesorMinutos > 0 ? ($totalHorasAsesorMinutos / $totalHorasProfesorMinutos) * 100 : 0;
    $porcentajeHorasTalent = $totalHorasTalentMinutos > 0 ? ($totalHorasAsesorMinutos / $totalHorasTalentMinutos) * 100 : 0;

    // Separar el nombre en Nombres y Apellidos
    $nombresApellidos = separarNombre($row['Nombre']);

    $asesoresData[] = [
        'Correo' => $row['Correo'],
        'Nombres' => $nombresApellidos['nombres'],
        'Apellidos' => $nombresApellidos['apellidos'],
        'Sesiones' => $row['Sesiones'],
        'TotalHorasTalent' => $totalHorasTalent,
        'DuracionMediaSesion' => $duracionMediaSesion,
        'PorcentajeHorasProf' => round($porcentajeHorasProf, 2) . '%',
        'PorcentajeHorasTalent' => round($porcentajeHorasTalent, 2) . '%'
    ];
}

$stmt->close();
$conn->close();

// Devolver los resultados como JSON
echo json_encode($asesoresData);

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
