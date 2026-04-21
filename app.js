// ── Datos Curva Atalah (Atalah et al. Rev Med Chile 1997 + MINSAL Chile) ──────
// Límites de IMC por semana de gestación (semanas 10 a 42)
const atalahSemanas = [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42];

// Límite superior zona Bajo Peso (= límite inferior Normal)
const limBP = [20.0,20.1,20.2,20.3,20.5,20.7,20.9,21.1,21.3,21.5,21.7,22.0,22.2,22.4,22.6,22.8,23.0,23.2,23.4,23.6,23.8,24.0,24.2,24.4,24.5,24.6,24.7,24.8,24.9,25.0,25.0,25.0,25.0];

// Límite superior zona Normal (= límite inferior Sobrepeso)
const limN  = [25.0,25.1,25.2,25.3,25.5,25.7,25.9,26.1,26.3,26.5,26.7,27.0,27.2,27.4,27.6,27.8,28.0,28.2,28.4,28.6,28.8,29.0,29.2,29.4,29.5,29.6,29.7,29.8,29.9,30.0,30.0,30.0,30.0];

// Límite superior zona Sobrepeso (= límite inferior Obesidad)
const limSP = [30.0,30.1,30.2,30.3,30.4,30.6,30.8,31.0,31.2,31.3,31.5,31.7,31.9,32.0,32.2,32.4,32.6,32.8,33.0,33.2,33.4,33.6,33.8,34.0,34.2,34.4,34.6,34.7,34.9,35.0,35.0,35.0,35.0];

// ── Colores de zonas (match imagen Atalah oficial) ────────────────────────────
const COLOR_BP = 'rgba(255, 100, 160, 0.40)';  // magenta — Bajo Peso
const COLOR_N  = 'rgba(0,  185, 140, 0.35)';   // teal    — Normal
const COLOR_SP = 'rgba(255, 210,  50, 0.45)';  // amarillo — Sobrepeso
const COLOR_OB = 'rgba(255, 130,   0, 0.50)';  // naranja  — Obesidad

// Convertir arrays a formato {x, y} para Chart.js
function toPoints(semanas, valores) {
    return semanas.map((s, i) => ({ x: s, y: valores[i] }));
}

// ── Inicializar Chart.js ──────────────────────────────────────────────────────
const ctx = document.getElementById('imcChart').getContext('2d');

const imcChart = new Chart(ctx, {
    type: 'line',
    data: {
        datasets: [
            // 0. Línea limBP — zona Bajo Peso: rellena hacia abajo hasta y=15
            {
                label: 'Bajo Peso',
                data: toPoints(atalahSemanas, limBP),
                borderColor: 'rgba(255,100,160,0.8)',
                borderWidth: 1.5,
                pointRadius: 0,
                fill: { target: { value: 15 }, above: COLOR_BP },  // target (15) está BAJO la línea → above aplica
                tension: 0.3,
                order: 4,
            },
            // 1. Línea limN — zona Normal: rellena hacia dataset 0 (limBP)
            {
                label: 'Normal',
                data: toPoints(atalahSemanas, limN),
                borderColor: 'rgba(0,185,140,0.8)',
                borderWidth: 1.5,
                pointRadius: 0,
                fill: { target: 0, above: COLOR_N, below: 'transparent' },  // dataset 0 (limBP) está BAJO → above
                tension: 0.3,
                order: 3,
            },
            // 2. Línea limSP — zona Sobrepeso: rellena hacia dataset 1 (limN)
            {
                label: 'Sobrepeso',
                data: toPoints(atalahSemanas, limSP),
                borderColor: 'rgba(255,180,0,0.8)',
                borderWidth: 1.5,
                pointRadius: 0,
                fill: { target: 1, above: COLOR_SP, below: 'transparent' },  // dataset 1 (limN) está BAJO → above
                tension: 0.3,
                order: 2,
            },
            // 3. Zona Obesidad: rellena desde limSP hacia arriba hasta y=40
            {
                label: 'Obesidad',
                data: toPoints(atalahSemanas, limSP),
                borderColor: 'transparent',
                borderWidth: 0,
                pointRadius: 0,
                fill: { target: { value: 40 }, below: COLOR_OB },  // target (40) está SOBRE la línea → below aplica
                tension: 0.3,
                order: 1,
            },
            // 5. Punto de la paciente
            {
                label: 'Paciente',
                type: 'scatter',
                data: [],
                pointBackgroundColor: 'red',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10,
                order: 0,
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'nearest', intersect: false },
        plugins: {
            legend: {
                display: true,
                labels: {
                    filter: (item) => ['Bajo Peso', 'Normal', 'Sobrepeso', 'Obesidad'].includes(item.text),
                    generateLabels: (chart) => {
                        const colores = { 'Bajo Peso': COLOR_BP, 'Normal': COLOR_N, 'Sobrepeso': COLOR_SP, 'Obesidad': COLOR_OB };
                        return Object.entries(colores).map(([label, color]) => ({
                            text: label,
                            fillStyle: color,
                            strokeStyle: color,
                            lineWidth: 0,
                            hidden: false,
                        }));
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        if (ctx.dataset.label === 'Paciente') {
                            return `IMC: ${ctx.parsed.y} | Semana: ${ctx.parsed.x}`;
                        }
                        return null;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                min: 10,
                max: 42,
                title: { display: true, text: 'Semanas de gestación', font: { size: 13 } },
                ticks: { stepSize: 2 }
            },
            y: {
                min: 15,
                max: 40,
                title: { display: true, text: 'IMC (kg/m²)', font: { size: 13 } },
                ticks: { stepSize: 5 }
            }
        }
    }
});

// ── Cálculo de semanas de gestación desde FUR ─────────────────────────────────
function calcularSemanasDesdefur(fur) {
    const hoy = new Date();
    const fechaFur = new Date(fur + 'T00:00:00');
    const dias = Math.floor((hoy - fechaFur) / (1000 * 60 * 60 * 24));
    return Math.floor(dias / 7);
}

// ── Cálculo IMC ───────────────────────────────────────────────────────────────
function calcularIMC(peso, talla) {
    return peso / (talla * talla);
}

// ── Diagnóstico según curva Atalah ────────────────────────────────────────────
function obtenerDiagnostico(imc, semana) {
    const idx = Math.round(semana) - 10;
    if (idx < 0 || idx >= limBP.length) return null;
    if (imc < limBP[idx]) return { texto: 'Bajo Peso', color: '#ff4499', bg: '#fff0f6' };
    if (imc < limN[idx])  return { texto: 'IMC Adecuado (Normal)', color: '#00a878', bg: '#f0fff8' };
    if (imc < limSP[idx]) return { texto: 'Sobrepeso', color: '#c98a00', bg: '#fffbec' };
    return { texto: 'Obesidad', color: '#d45500', bg: '#fff3ec' };
}

// ── Filtro teclado campos decimales ───────────────────────────────────────────
function soloDecimal(e) {
    const CONTROL = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
    if (CONTROL.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return; // copiar/pegar/seleccionar
    if (!/[\d.,]/.test(e.key)) { e.preventDefault(); return; }
    // solo un separador por campo
    if ((e.key === '.' || e.key === ',') && /[.,]/.test(e.target.value)) {
        e.preventDefault();
    }
}

// ── DOM refs ──────────────────────────────────────────────────────────────────
const form                = document.getElementById('imcForm');
const pesoInput           = document.getElementById('peso');
const tallaInput          = document.getElementById('talla');
const furInput            = document.getElementById('fur');
const semanasInput        = document.getElementById('semanasGestacion');
const resultadoDiv        = document.getElementById('resultado');
const imcResultadoSpan    = document.getElementById('imcResultado');
const semanasResultadoSpan = document.getElementById('semanasResultado');
const diagnosticoSpan     = document.getElementById('diagnostico');

pesoInput.addEventListener('keydown', soloDecimal);
tallaInput.addEventListener('keydown', soloDecimal);

// FUR: máximo = hoy (no permitir fechas futuras)
furInput.max = new Date().toISOString().split('T')[0];

// Auto-rellenar semanas cuando se ingresa FUR
furInput.addEventListener('change', function () {
    if (!furInput.value) return;
    const semanas = calcularSemanasDesdefur(furInput.value);
    if (semanas >= 10 && semanas <= 42) {
        semanasInput.value = semanas;
    } else if (semanas < 10) {
        semanasInput.value = '';
        alert('FUR indica menos de 10 semanas. Ingrese semanas manualmente.');
    } else {
        semanasInput.value = 42;
        alert('FUR indica más de 42 semanas. Se usará semana 42.');
    }
});

// ── Submit ─────────────────────────────────────────────────────────────────────
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const peso   = parseFloat(pesoInput.value.replace(/,/g, '.'));
    const talla  = parseFloat(tallaInput.value.replace(/,/g, '.'));
    const semana = parseFloat(semanasInput.value);

    if (isNaN(peso) || peso <= 0 || isNaN(talla) || talla <= 0) {
        alert('Ingrese peso y talla válidos.');
        return;
    }
    if (isNaN(semana) || semana < 10 || semana > 42) {
        alert('Semanas de gestación debe estar entre 10 y 42.');
        return;
    }

    // Detectar si talla fue ingresada en cm (valor > 3 → asumir cm → convertir)
    const tallaM = talla > 3 ? talla / 100 : talla;

    const imc = calcularIMC(peso, tallaM);
    const diagnostico = obtenerDiagnostico(imc, semana);

    // Actualizar punto en gráfica
    imcChart.data.datasets[4].data = [{ x: semana, y: parseFloat(imc.toFixed(2)) }];
    imcChart.update();

    // Mostrar resultado
    imcResultadoSpan.textContent    = imc.toFixed(2);
    semanasResultadoSpan.textContent = Math.round(semana);
    diagnosticoSpan.textContent     = diagnostico ? diagnostico.texto : '—';

    resultadoDiv.style.display      = 'block';
    resultadoDiv.style.borderColor  = diagnostico ? diagnostico.color : '#ccc';
    resultadoDiv.style.background   = diagnostico ? diagnostico.bg    : '#fff';
    diagnosticoSpan.style.color     = diagnostico ? diagnostico.color : '#333';
});
