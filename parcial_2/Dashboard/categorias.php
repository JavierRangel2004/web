<?php
header('Content-Type: application/json; charset=utf-8');
include 'components/sql.php';

// Deshabilitar la visualización de errores en producción
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
$categoriasFilter = isset($data['categorias']) ? $data['categorias'] : []; // Array de IDs de categorías

// Inicializar el arreglo de categorías
$categorias = [];

// Construir la consulta con filtros
$query = "
    SELECT 
        categoria.ID, 
        categoria.Llave, 
        categoria.Nombre,
        COUNT(DISTINCT asesoria.ID) AS Sesiones,
        COUNT(DISTINCT asesor.ID) AS Profesores,
        SUM(asesoria.Duracion) AS TotalHorasProfesor,
        SUM(asesoria.Duracion) AS TotalHorasTalent,
        (SUM(asesoria.Duracion) / COUNT(DISTINCT asesoria.ID)) AS DuracionMediaProfesor,
        (SUM(asesoria.Duracion) / COUNT(DISTINCT asesoria.ID)) AS DuracionMediaTalent
    FROM 
        asesoria
    JOIN 
        categoria ON asesoria.id_Categoria = categoria.ID
    JOIN 
        asesoria_asesor ON asesoria.ID = asesoria_asesor.id_Asesoria
    JOIN 
        asesor ON asesoria_asesor.id_Asesor = asesor.ID
    JOIN 
        sedes ON asesoria.id_Sede = sedes.ID
    WHERE 
        1=1
";

// Inicializar parámetros
$params = [];
$types = '';

// Aplicar filtros de fechas
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

// Aplicar filtro de asesores
if (!empty($asesores)) {
    $placeholders = implode(',', array_fill(0, count($asesores), '?'));
    $query .= " AND asesor.ID IN ($placeholders)";
    $params = array_merge($params, $asesores);
    $types .= str_repeat('i', count($asesores));
}

// Aplicar filtro de sedes
if (!empty($sedes)) {
    $placeholders = implode(',', array_fill(0, count($sedes), '?'));
    $query .= " AND sedes.ID IN ($placeholders)";
    $params = array_merge($params, $sedes);
    $types .= str_repeat('i', count($sedes));
}

// Aplicar filtro de categorías (si se desea filtrar también en categorias.php)
if (!empty($categoriasFilter)) {
    $placeholders = implode(',', array_fill(0, count($categoriasFilter), '?'));
    $query .= " AND categoria.ID IN ($placeholders)";
    $params = array_merge($params, $categoriasFilter);
    $types .= str_repeat('i', count($categoriasFilter));
}

// Agrupar por categoría
$query .= " GROUP BY categoria.ID, categoria.Llave, categoria.Nombre";

// Preparar y ejecutar la consulta
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
    // Formatear las horas a "HH:MM"
    $totalHorasProfesor = floor($row['TotalHorasProfesor'] / 60) . ':' . str_pad($row['TotalHorasProfesor'] % 60, 2, '0', STR_PAD_LEFT);
    $totalHorasTalent = floor($row['TotalHorasTalent'] / 60) . ':' . str_pad($row['TotalHorasTalent'] % 60, 2, '0', STR_PAD_LEFT);
    $duracionMediaProfesor = floor($row['DuracionMediaProfesor'] / 60) . ':' . str_pad(round($row['DuracionMediaProfesor'] % 60), 2, '0', STR_PAD_LEFT);
    $duracionMediaTalent = floor($row['DuracionMediaTalent'] / 60) . ':' . str_pad(round($row['DuracionMediaTalent'] % 60), 2, '0', STR_PAD_LEFT);

    $categorias[] = [
        'ID' => $row['ID'], // Incluir el ID de la categoría
        'Llave' => $row['Llave'],
        'Nombre' => $row['Nombre'],
        'Sesiones' => $row['Sesiones'],
        'Profesores' => $row['Profesores'],
        'TotalHorasProfesor' => $totalHorasProfesor,
        'TotalHorasTalent' => $totalHorasTalent,
        'DuracionMediaProfesor' => $duracionMediaProfesor,
        'DuracionMediaTalent' => $duracionMediaTalent
    ];
}

$stmt->close();
$conn->close();

// Devolver los resultados como JSON
header('Content-Type: application/json; charset=utf-8');
echo json_encode($categorias);
?>
