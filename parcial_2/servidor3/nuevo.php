<!doctype html>
<html lang="en">

<head>
    <?php include './components/header.php'; ?>
    <title>Nuevo Producto</title>
</head>

<body>
    
    <?php include './components/navbar.php'; ?>

    <div class="contenedor d-flex">
        <div class="mx-auto mt-3 mb-auto border p-3">
            <h1 class="mb-3 text-center">Nuevo producto</h1>
            <hr>
            <div>
                <div class="input-group mb-3">
                    <span class="input-group-text">Nombre:</span>
                    <input type="text" class="form-control" id="nombre" name="nombre" placeholder="Nombre del producto">
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">Cantidad:</span>
                    <input type="text" class="form-control" id="cant" name="cant" placeholder="Cantidad en inventario">
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text">Precio:</span>
                    <input type="text" class="form-control" id="precio" name="precio" placeholder="Precio del producto">
                </div>
                <div class="d-flex">
                    <button type="button" class="ms-auto me-1 btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modal-confirmacion">Cancelar</button>
                    <button type="button" onclick="guardarProducto()" class="ms-1 me-auto btn btn-primary" id="btn-agregar">Agregar</button>
                </div>
    </div>
        </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="modal-confirmacion" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Confirmación</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <h2>¿Seguro desea salir?</h2>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <a type="button" class="btn btn-primary" href="productos.php">Continuar</a>
            </div>
            </div>
        </div>
    </div>
    <script src="./js/nuevoproducto.js"></script>
</body>

</html>

<script>

    $('#title').html('Registro de productos');

</script>