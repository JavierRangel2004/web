<?php

    include './components/sql.php';

    $productos = [];
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }else{
        $query = "select * from productos";
        $result = $conn->query($query);
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                array_push($productos,$row);
            }
        }
    }
    

?>

<!doctype html>
<html lang="en">

<head>
    <?php include './components/header.php'; ?>
    <title>Productos</title>
</head>

<body>
    
    <?php include './components/navbar.php'; ?>

    <div class="contenedor d-flex">
        <div class="mx-auto mt-3 mb-auto border p-3">
            <table class="table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                        for($i = 0; $i<count($productos); $i++){
                            echo "<tr>";
                            echo "<td>".$productos[$i]["Nombre"]."</td>";
                            echo "<td> $".$productos[$i]["Precio"]."</td>";
                            echo "<td>".$productos[$i]["Inventario"]."</td>";
                            echo "<td><button onclick=\"comprar('".$productos[$i]["Nombre"]."',".$productos[$i]["Precio"].")\" class='btn btn-sm btn-success'><i class='fa fa-cart-plus'></i></button></td>";
                            echo "</tr>";
                        }
                    ?>
                </tbody>
            </table>
            <div class="d-flex">
                <a href="nuevo.php" class="m-auto btn btn-danger btn-small">Registrar Producto</a>
            </div>
        </div>
    </div>
    
    <script src="./js/addCart.js"></script>

</body>

</html>

<script>

    $('#title').html('Lista de productos');

</script>