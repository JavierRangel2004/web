<?php

include 'sql.php';

$cart = $_POST['cart'];

$errores = [];
foreach ($cart as $p) {
    // Registrar la venta
    $query = "insert into ventas (Nombre,PrecioUnit,PrecioTotal,Cantidad)";
    $query .= ' values ("'.$p['Nombre'].'",'.$p['Precio'].','.$p['Precio'].'*'.$p['Items'].','.$p['Items'].')';
    $result = $conn->query($query);
    if(!$result){
        array_push($errores,$conn->error);
    } else {
        // Actualizar el inventario en la tabla productos
        $updateQuery = "UPDATE productos SET Inventario = Inventario - ".$p['Items']." WHERE Nombre = '".$p['Nombre']."'";
        $updateResult = $conn->query($updateQuery);
        if (!$updateResult) {
            array_push($errores, "Error al actualizar inventario: ".$conn->error);
        }
    }
}

if(count($errores) > 0){
    echo "500 - error: ".implode('; ', $errores);
}else{
    echo "200 - done";
}

$conn->close();

?>
