<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bootstrap demo</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    </head>
    <body>
        <?php include "components/navbar.php"; ?>
        <div class ="contenedor d-flex">
            <div class = "m-auto border p-3"
                <table class = "table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody id = "tb-productos">
                    </tbody>
                </table>
                <div class = "d-flex">
                    <a href="nuevoProd.php" class="m-auto btn btn-primary btn-sm">Nuevo</a>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    </body>
</html>

<script>

    let carrito = localStorage.getItem('carrito');
    carrito = carrito ? JSON.parse(carrito) : [];
    let tbody = ""
    for (let i = 0; i < carrito.length; i++) {
        tbody += "<tr>";
        tbody += "<td>" + carrito[i].nombre + "</td>";
        tbody += "<td>" + carrito[i].cantidad + "</td>";
        tbody += "<td>" + carrito[i].precio + "</td>";
        tbody += "<td>" + carrito[i].precio * carrito[i].cantidad + "</td>";
        tbody += "</tr>";
    }

    $('#tb-productos').html(tbody);


</script>