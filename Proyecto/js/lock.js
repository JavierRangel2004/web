let angulos = [0, 0, 0, 0, 0];  // Angulos para cada círculo
let circuloSeleccionado = 0;     // El círculo que se está rotando

document.addEventListener('DOMContentLoaded', () => {
    arrangeRunes();
});

function arrangeRunes() {
    // Organizar las runas en cada circulo a partir del circulo 2 al 5
    // cada circulo tiene 8 runas y deben de alinearse con su circulo o div padre
    
}

// Selecciona el círculo al que aplicaremos la rotación
document.querySelectorAll('.circulo').forEach((circulo, index) => {
    circulo.addEventListener('click', () => {
        circuloSeleccionado = index;
        console.log(`Círculo seleccionado: ${circuloSeleccionado + 1}`);
    });
});

document.getElementById('arriba').addEventListener('click', () => {
    rotarCírculo(circuloSeleccionado, 45);  // Giramos 45 grados en sentido horario
});

document.getElementById('abajo').addEventListener('click', () => {
    rotarCírculo(circuloSeleccionado, -45);  // Giramos 45 grados en sentido antihorario
});

function rotarCírculo(index, incremento) {
    angulos[index] += incremento;
    const circulo = document.getElementById(`circulo-${index + 1}`);
    circulo.style.transform = `translate(-50%, -50%) rotate(${angulos[index]}deg)`;
}
