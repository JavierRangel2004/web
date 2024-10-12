<?php
// Definir la ruta donde se guardará el archivo JSON
$path = './../db/productos.json';
$productos = [];

// Si el archivo existe, decodificamos el JSON para obtener los productos existentes
if (file_exists($path)) {
    $productos = json_decode(file_get_contents($path), true);
}

// Agregar el nuevo producto recibido por POST al array de productos
array_push($productos, [
    "nombre" => $_POST["nombre"],
    "cantidad" => $_POST["cantidad"],
    "precio" => $_POST["precio"]
]);

// Guardar los productos actualizados de vuelta en el archivo JSON
file_put_contents($path, json_encode($productos, JSON_PRETTY_PRINT));

var_dump($productos);
var_dump($_POST);

?>
