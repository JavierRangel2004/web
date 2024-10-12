function guardarProducto(){
    $('#btn-agregar').prop('disabled',true);
    let config = {
        url:"components/guardar.php",
        method:'post',
        data:{
            'nombre':$('#nombre').val(),
            'precio':$('#precio').val(),
            'inventario':$('#cant').val()
        },
        success: (response)=>{
            if(response.indexOf('200 - ') == 0){
                alert("Producto agregado exitosamente");
                $('#nombre').val("");
                $('#precio').val("");
                $('#cant').val("");
            }else{
                alert("Se produjo un "+response);
            }
            $('#btn-agregar').prop('disabled',false);
        },
        error: (xhr,status,error)=>{
            console.log(error);
            $('#btn-agregar').prop('disabled',false);
        },
    };
    $.ajax(config);
}

function regresar(){

    let r = confirm("Seguro desea salir?");
    if(r){
        location.href="productos.php";
    }

}