const rotacion = 10;
const diferentes = 200;
let Selected = 0;
const actuales = [0, 0, 0, 0, 0];
let correcta = [1, 4, 7, 11, 22]; 
const one_five = ['#Circle1', '#Circle2', '#Circle3', '#Circle4', '#Circle5'].map(id => $(id));
const icons = [
  '<i class="fas fa-heart text-3xl"></i>',
  '<i class="fas fa-moon text-3xl"></i>',
  '<i class="fas fa-star text-3xl"></i>',
  '<i class="fas fa-cloud text-3xl"></i>',
  '<i class="fas fa-tree text-3xl"></i>',
  '<i class="fas fa-sun text-3xl"></i>',
  '<i class="fas fa-umbrella-beach text-3xl"></i>',
  '<i class="fas fa-snowflake text-3xl"></i>',
  '<i class="fas fa-cloud-moon text-3xl"></i>',
  '<i class="fas fa-cloud-sun text-3xl"></i>',
  '<i class="fas fa-cloud-sun-rain text-3xl"></i>',
  '<i class="fas fa-cloud-showers-heavy text-3xl"></i>',
  '<i class="fas fa-cloud-rain text-3xl"></i>',
];

let inicio, timer;

$(document).ready(() => {
  ['#arriba', '#abajo'].forEach(button => $(button).prop('disabled', true));

  actualiza();
  reacomodar();
});

function IconosR(circleId, circleSize, iconCount) {
  const peso = (2 * Math.PI) / iconCount;
  let angulo = (-90 * Math.PI) / 180;

  for (let i = 0; i < iconCount; i++) {  
    const icon = icons[i % icons.length];
    const x = Math.round(circleSize / 2 + (circleSize / 2) * Math.cos(angulo));
    const y = Math.round(circleSize / 2 + (circleSize / 2) * Math.sin(angulo));
    $('<div></div>')
      .css({ right: `${x}px`, top: `${y}px` })
      .addClass('absolute h-[40px] w-[40px] icon')
      .attr('data-index', i)
      .appendTo(`#${circleId}`)
      .append($(icon).addClass('h-[10px] w-[10px] translate-x-[20px] -translate-y-[20px] transition-all group-hover:text-blue-300'));
    angulo -= peso;
  }
}

const iconCounts = [13, 11, 9, 7, 5];
[500, 400, 300, 200, 100].forEach((size, i) => IconosR(`Circle${i + 1}`, size, iconCounts[i]));

['#arriba', '#abajo'].forEach((id, arr) => {
  $(id).on('mousedown', () => Rotaciones(arr));
  $(id).on('mouseup', parar);
});

function Seleccionado(id) {
  Selected = id;
  actualiza();
}

function parar() {
  clearTimeout(inicio);
  clearInterval(timer);
}

function Rotaciones(arr) {
  vueltas(arr ? 1 : -1);
  clearTimeout(inicio);

  inicio = setTimeout(() => {
    timer = setInterval(() => vueltas(arr ? 1 : -1), 100);
  });
}

function vueltas(direccion) {
  actuales[Selected] += direccion;
  actualiza();
}

function actualiza() {
  one_five.forEach((circle, i) => {
    circle.css('box-shadow', '');
    const degrees = (actuales[i] - 3) * rotacion;
    circle.css('transform', `rotate(${degrees}deg)`);

    icons.forEach((_, j) => {
      $(`#${circle.attr('id')} .icon[data-index="${j}"]`).removeClass('correct').css('filter', 'none');
    });
  });

  one_five[Selected].css('box-shadow', '0px 0px 10px 0px #b833a6');
  chequeo();
}

function chequeo() {
  let isCorrect = true;

  actuales.forEach((rotation, i) => {
    const posicion_actual = Math.abs(rotation % 36);
    const posicion_correct = correcta[i];
    if (posicion_actual === posicion_correct) {
      const circleIconIndex = Math.floor(posicion_actual / 6);
      const circleId = one_five[i].attr('id');
     
      $(`#${circleId}`).addClass('correct-circle').css('box-shadow', '0px 0px 15px 5px rgba(59, 130, 246, 0.7)');
      $(`#${circleId} .icon`).css('color', 'rgba(59, 130, 246, 0.7');
    } else {
      isCorrect = false;
      const circleId = one_five[i].attr('id');

      $(`#${circleId}`).removeClass('correct-circle').css('box-shadow', '');
      $(`#${circleId} .icon`).css('color', ''); 
      
    }
  });

  if (isCorrect) abrirNotif();
}

function abrirNotif() {
  $('#secretModal').removeClass('hidden').addClass('flex');
  setTimeout(() => {
    window.location.reload();
  }, 5000);
}

function cerrarN() {
  $('#secretModal').addClass('hidden').removeClass('flex');
}

function reacomodar() {
  let contador = 0;

  const intervalo = setInterval(() => {
    const CirculitosR = Math.floor(Math.random() * 5);
    
    const Direcciones = Math.random() < 0.5 ? 1 : -1;

    Seleccionado(CirculitosR);
    vueltas(Direcciones);

    if (++contador === diferentes) {
      clearInterval(intervalo);
      ['#arriba', '#abajo'].forEach(button => $(button).prop('disabled', false));
      Seleccionado(0);
    }
  }, 10);
}
