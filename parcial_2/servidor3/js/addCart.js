function comprar(n,p){
    
    let carrito = localStorage.getItem("carrito");
    carrito = carrito? JSON.parse(carrito): [];

    let index = -1;
    for(let i = 0; i < carrito.length; i++){
        if(carrito[i].Nombre == n){
            index = i;
        }
    }

    if(index == -1){
        carrito.push({'Nombre':n,'Precio':p, 'Items':0});
        index = carrito.length-1;
    }

    carrito[index]['Items']++;
    localStorage.setItem("carrito",JSON.stringify(carrito));

    updateCartIcon();
}