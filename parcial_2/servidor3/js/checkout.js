function loadProductos() {
    let total = 0;
    let carrito = localStorage.getItem("carrito");
    carrito = carrito ? JSON.parse(carrito) : [];
    if (carrito.length > 0) {
        let tbody = "";
        for (let i = 0; i < carrito.length; i++) {
            tbody += "<tr>";
            tbody += "<td>" + carrito[i].Nombre + "</td>";
            tbody += "<td><input type='number' value='" + carrito[i].Items + "' step='1' min='0' class='form-control my-input' onchange='updateCantidad(" + i + ", this.value)'></td>";
            tbody += "<td> $" + carrito[i].Precio + "</td>";
            tbody += "<td> $" + carrito[i].Precio * carrito[i].Items + "</td>";
            tbody += "<td><button class='btn btn-danger' onclick='eliminarProducto(" + i + ")'>Eliminar</button></td>";
            tbody += "</tr>";

            total += carrito[i].Precio * carrito[i].Items;
        }
        $('#tbody').html(tbody);
        $('#total').html(total);
    }
}

// Función para actualizar la cantidad de un producto
function updateCantidad(index, cantidad) {
    let carrito = localStorage.getItem("carrito");
    carrito = carrito ? JSON.parse(carrito) : [];

    // Actualizar la cantidad en el carrito
    if (cantidad == 0) {
        carrito.splice(index, 1);  // Elimina el producto si la cantidad es 0
    } else {
        carrito[index].Items = parseInt(cantidad);
    }

    // Actualizar el carrito en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Recargar productos para reflejar cambios
    loadProductos();
}

// Función para eliminar un producto completamente
function eliminarProducto(index) {
    let carrito = localStorage.getItem("carrito");
    carrito = carrito ? JSON.parse(carrito) : [];

    // Eliminar el producto del carrito
    carrito.splice(index, 1);

    // Actualizar el carrito en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Recargar productos para reflejar cambios
    loadProductos();
}

function pagarProductos() {
    $('#btn-pagar').prop('disabled', false);
    let carrito = localStorage.getItem("carrito");
    carrito = carrito ? JSON.parse(carrito) : [];
    if (carrito.length > 0) {
        $.ajax({
            url: "components/vender.php",
            method: 'post',
            data: {
                'cart': carrito
            },
            success: (response) => {
                if (response.indexOf('200 - ') == 0) {
                    alert("Venta realizada con éxito");
                    localStorage.setItem("carrito", "[]");
                    location.href = 'productos.php';
                } else {
                    alert("Se produjo un " + response);
                }
                $('#btn-pagar').prop('disabled', false);
            },
            error: (xhr, status, error) => {
                console.log(error);
                $('#btn-pagar').prop('disabled', false);
            },
        });
    }
}

loadProductos();

console.log("loaded");
