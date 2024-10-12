<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agregar Nuevo Producto</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <style>
        /* Centrando el formulario en la pantalla */
        .form-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .form-box {
            border: 1px solid #ccc;
            padding: 30px;
            border-radius: 10px;
            background-color: #f9f9f9;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 400px;
        }
    </style>
</head>
<body>

    <div class="form-container">
        <div class="form-box">
            <h1>Agregar Nuevo Producto</h1>
            <div>
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre del Producto:</label>
                    <input type="text" id="nombre" name="nombre" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="cantidad" class="form-label">Cantidad:</label>
                    <input type="number" id="cantidad" name="cantidad" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label for="precio" class="form-label">Precio:</label>
                    <input type="number" step="0.01" id="precio" name="precio" class="form-control" required>
                </div>
                <button type="button" onclick="guardarProducto()" class="btn btn-success">Agregar</button>
                <button type="button" class="btn btn-danger" id="cancelBtn">Cancelar</button>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" id="cancelModal" tabindex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="cancelModalLabel">Confirmación</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ¿Está seguro que desea cancelar la operación?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-danger" id="confirmCancelBtn">Sí, Cancelar</button>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>

    <script>
        function guardarProducto(){
            let config = {
                url: './components/guardar.php',
                method: 'POST',
                data: {
                    'nombre':$('#nombre').val(),
                    'cantidad':$('#cantidad').val(),
                    'precio':$('#precio').val()
                },
                success: (response) => {
                    console.log(response);
                    alert('Producto guardado exitosamente');
                    document.querySelector('form').reset();
                },
                error: (xhr,status,error) => {
                    console.error(error);
                    alert('Ocurrió un error al guardar el producto');
                }
            };
            $.ajax(config);
        // Abrir el modal al hacer clic en "Cancelar"
        document.getElementById('cancelBtn').addEventListener('click', function() {
            var cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
            cancelModal.show();
        });

        // Confirmar la cancelación y resetear el formulario
        document.getElementById('confirmCancelBtn').addEventListener('click', function() {
            document.querySelector('form').reset();
            var cancelModal = bootstrap.Modal.getInstance(document.getElementById('cancelModal'));
            cancelModal.hide();
        });
    </script>

</body>
</html>
