<!doctype html>
<html lang="en">

<head>
    <?php include 'components/header.php'; ?>
    <title>Productos</title>
</head>

<body>
    
    <?php include 'components/navbar.php'; ?>

    <div class="container contenedor">
        <div class="row">
            <div class="col d-flex">
                <div class="mx-auto mt-3 mb-auto border p-3">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cant</th>
                                <th>Precio Unit.</th>
                                <th>Precio Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-3">
                <h1>Total a pagar: $<span id="total"></span></h1>
                <div class="d-flex my-3">
                    <button type="button" href="nuevo.php" id="btn-pagar" class="m-auto btn btn-danger btn-lg" onclick="pagarProductos()"><i class="fa fa-wallet"></i>&nbsp;Pagar</a>
                </div>
            </div>
        </div>
        
    </div>
    <script src="js/checkout.js"></script>

</body>

</html>

<script>

    $('#title').html('Checkout');

</script>