<?php

    include 'sql.php';

    $query = "insert into productos (Nombre,Precio,Inventario)";
    $query .= ' values ("'.$_POST['nombre'].'",'.$_POST['precio'].','.$_POST['inventario'].')';

   
    $result = $conn->query($query);
    
    if(!$result){
        echo "500 - error: ".$conn->error;
    }else{
        echo "200 - done";
    }

    $conn->close();

?>
