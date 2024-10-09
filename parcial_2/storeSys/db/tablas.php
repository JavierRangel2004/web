<?php
// Definir la ruta al archivo JSON
$path = './productos.json';
$productos = [];

// Verificar si el archivo existe, si es así, leer su contenido
if (file_exists($path)) {
    $productos = json_decode(file_get_contents($path), true);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lista de Productos</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
</head>
<body>

    <div class="container mt-5">
        <h1>Lista de Productos</h1>
        <?php if (!empty($productos)): ?>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($productos as $producto): ?>
                <tr>
                    <td><?php echo htmlspecialchars($producto["nombre"]); ?></td>
                    <td><?php echo htmlspecialchars($producto["cantidad"]); ?></td>
                    <td><?php echo htmlspecialchars($producto["precio"]); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <?php else: ?>
            <p>No hay productos en la lista.</p>
        <?php endif; ?>
        <a href="../pagina.php" class="btn btn-primary">Agregar otro producto</a>
    </div>

</body>
</html>
