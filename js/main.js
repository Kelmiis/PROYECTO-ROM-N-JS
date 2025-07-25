const montoInput = document.getElementById('montoInput');
const tasaInput = document.getElementById('tasaInput');
const plazoInput = document.getElementById('plazoInput');
const calcularPrestamoBtn = document.getElementById('calcularPrestamoBtn');
const limpiarCamposBtn = document.getElementById('limpiarCamposBtn');

const displayMonto = document.getElementById('displayMonto');
const displayTasa = document.getElementById('displayTasa');
const displayPlazo = document.getElementById('displayPlazo');
const pagoMensualValor = document.getElementById('pagoMensualValor');
const mensajeErrorDiv = document.getElementById('mensajeError');

const lastMonto = document.getElementById('lastMonto');
const lastTasa = document.getElementById('lastTasa');
const lastPlazo = document.getElementById('lastPlazo');
const lastPago = document.getElementById('lastPago');
const cargarUltimaSimBtn = document.getElementById('cargarUltimaSimBtn');
const borrarUltimaSimBtn = document.getElementById('borrarUltimaSimBtn');

const CLAVE_ULTIMA_SIMULACION = "ultimaSimulacionPrestamo";

function mostrarError(mensaje) {
    mensajeErrorDiv.textContent = mensaje;
    mensajeErrorDiv.style.display = 'block';
}

function ocultarError() {
    mensajeErrorDiv.textContent = '';
    mensajeErrorDiv.style.display = 'none';
}

function formatearNumero(numero) {
    if (isNaN(numero)) return '0';
    return numero.toLocaleString('es-CL');
}

function validarDatos(monto, tasa, plazo) {
    ocultarError();
    if (isNaN(monto) || !Number.isInteger(monto) || monto <= 0) {
        mostrarError("Error: El Monto debe ser un número entero y positivo.");
        return false;
    }
    if (isNaN(tasa) || !Number.isInteger(tasa) || tasa < 0) {
        mostrarError("Error: La Tasa de interés debe ser un número entero no negativo.");
        return false;
    }
    if (isNaN(plazo) || !Number.isInteger(plazo) || plazo <= 0) {
        mostrarError("Error: El Plazo debe ser un número entero y positivo.");
        return false;
    }
    return true;
}

function calcularPagoMensual(monto, tasaAnual, meses) {
    const interesTotalEstimado = monto * (tasaAnual / 100);
    const montoTotalAPagar = monto + interesTotalEstimado;
    return montoTotalAPagar / meses;
}

function mostrarResultadosEnDOM(datos) {
    const [monto, tasa, plazo, pagoCalculado] = datos;
    const pagoRedondeado = Math.round(pagoCalculado * 100) / 100;

    displayMonto.textContent = formatearNumero(monto);
    displayTasa.textContent = tasa;
    displayPlazo.textContent = plazo;
    pagoMensualValor.textContent = `$${formatearNumero(pagoRedondeado)}`;
}

function guardarUltimaSimulacion(simulacion) {
    localStorage.setItem(CLAVE_ULTIMA_SIMULACION, JSON.stringify(simulacion));
    renderizarUltimaSimulacion();
}

function renderizarUltimaSimulacion() {
    const ultimaSimulacionJSON = localStorage.getItem(CLAVE_ULTIMA_SIMULACION);
    if (ultimaSimulacionJSON) {
        const ultimaSimulacion = JSON.parse(ultimaSimulacionJSON);
        const pagoRedondeado = Math.round(ultimaSimulacion[3] * 100) / 100;

        lastMonto.textContent = formatearNumero(ultimaSimulacion[0]);
        lastTasa.textContent = ultimaSimulacion[1];
        lastPlazo.textContent = ultimaSimulacion[2];
        lastPago.textContent = `$${formatearNumero(pagoRedondeado)}`;
        lastSimulationDisplay.style.display = 'block';
    } else {
        lastSimulationDisplay.style.display = 'none';
    }
}

function cargarDatosEnInputs() {
    ocultarError();
    const ultimaSimulacionJSON = localStorage.getItem(CLAVE_ULTIMA_SIMULACION);

    if (ultimaSimulacionJSON) {
        const ultimaSimulacion = JSON.parse(ultimaSimulacionJSON);
        montoInput.value = ultimaSimulacion[0];
        tasaInput.value = ultimaSimulacion[1];
        plazoInput.value = ultimaSimulacion[2];
        mostrarError("Datos de la última simulación cargados en los campos.");
    } else {
        mostrarError("No hay una simulación previa guardada para cargar.");
    }
}

function borrarUltimaSimulacion() {
    ocultarError();
    localStorage.removeItem(CLAVE_ULTIMA_SIMULACION);
    renderizarUltimaSimulacion();
    mostrarError("Última simulación borrada con éxito.");
}

function limpiarCampos() {
    ocultarError();
    montoInput.value = '';
    tasaInput.value = '';
    plazoInput.value = '';
    
    displayMonto.textContent = '0';
    displayTasa.textContent = '0';
    displayPlazo.textContent = '0';
    pagoMensualValor.textContent = '$0';
}

calcularPrestamoBtn.addEventListener('click', () => {
    const monto = parseInt(montoInput.value, 10);
    const tasa = parseInt(tasaInput.value, 10);
    const plazo = parseInt(plazoInput.value, 10);
    if (validarDatos(monto, tasa, plazo)) {
        const pagoCalculado = calcularPagoMensual(monto, tasa, plazo);
        const datosSimulacionActual = [monto, tasa, plazo, pagoCalculado];
        mostrarResultadosEnDOM(datosSimulacionActual);
        guardarUltimaSimulacion(datosSimulacionActual);
    }
});

limpiarCamposBtn.addEventListener('click', limpiarCampos);
cargarUltimaSimBtn.addEventListener('click', cargarDatosEnInputs);
borrarUltimaSimBtn.addEventListener('click', borrarUltimaSimulacion);

document.addEventListener('DOMContentLoaded', () => {
    renderizarUltimaSimulacion();
    limpiarCampos();
});