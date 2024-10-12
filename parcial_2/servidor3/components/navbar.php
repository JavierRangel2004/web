<nav class="navbar fixed-top navbar-expand-lg bg-black">
    <div class="container-fluid">
        <a class="navbar-brand ms-lg-2 py-2 px-3 rounded bg-white" href="productos.php"><img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/Artist_Painting_Palette_Flat_Icon_Vector.svg" height="50"></a>
        <h3 id="title" class="text-white">Productos</h3>
        <a class="btn btn-warning" href="checkout.php"><i class="fa fa-shopping-cart"></i><span id="carrito"></span></a>
    </div>
</nav>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

<script>
    function updateCartIcon(){
        let carrito = localStorage.getItem("carrito");
        carrito = carrito? JSON.parse(carrito): [];
        if(carrito.length > 0){
            $('#carrito').html(" ("+carrito.length+")");
        }else{
            $('#carrito').html("");
        }
    }
    updateCartIcon();
</script>