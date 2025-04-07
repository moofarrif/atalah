// Obtener referencias a los elementos del DOM
const form = document.getElementById('imcForm');
const pesoInput = document.getElementById('peso');
const tallaInput = document.getElementById('talla');
const semanasGestacionInput = document.getElementById('semanasGestacion');
const ctx = document.getElementById('imcChart').getContext('2d');

// Función para calcular el IMC
function calcularIMC(peso, talla) {
    if (peso && talla) {
        return (peso / (talla * talla)).toFixed(2);
    }
    return 0;
}

// Inicializar Chart.js
let imcChart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'IMC',
            data: [], // Aquí se cargará el IMC calculado
            pointBackgroundColor: 'red',  // Punto rojo
            pointRadius: 5,
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Semanas de gestación'
                },
                min: 10,  // Empezar en la semana 10
                max: 40   // Terminar en la semana 40
            },
            y: {
                title: {
                    display: true,
                    text: 'IMC'
                },
                min: 15,  // Ajustamos los rangos como en la imagen
                max: 40
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    }
});

// Función para actualizar la gráfica
function actualizarGrafica(imc, semana) {
    // Limpiar los datos anteriores y agregar el nuevo punto
    imcChart.data.datasets[0].data = [{x: semana, y: imc}];
    imcChart.update();
}

// Manejar el evento de envío del formulario
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Reemplazar la coma por un punto en el peso y la talla para convertirlos a formato numérico válido
    const peso = parseFloat(pesoInput.value.replace(',', '.'));
    const talla = parseFloat(tallaInput.value.replace(',', '.'));
    const semanasGestacion = parseInt(semanasGestacionInput.value);

    // Validar que los valores convertidos sean números válidos
    if (!isNaN(peso) && peso > 0 && !isNaN(talla) && talla > 0 && semanasGestacion >= 10 && semanasGestacion <= 40) {
        const imc = calcularIMC(peso, talla);
        actualizarGrafica(imc, semanasGestacion);
    } else {
        alert('Por favor, introduce valores válidos.');
    }
});
