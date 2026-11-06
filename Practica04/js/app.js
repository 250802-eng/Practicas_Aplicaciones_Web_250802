let pasoActual = 1;

document.addEventListener("DOMContentLoaded", function () {
    actualizarVistaWizard();

    // Eventos para resaltar líneas al escribir o seleccionar datos
    const inputs = document.querySelectorAll(".input-underline");
    inputs.forEach(input => {
        input.addEventListener("input", function () {
            limpiarErrorInput(this);
        });
        input.addEventListener("change", function () {
            limpiarErrorInput(this);
        });
    });

    // Lógica para el cálculo de edad
    const fechaNac = document.getElementById("fechaNacimiento");
    const resultadoEdad = document.getElementById("resultadoEdad");

    if (fechaNac) {
        fechaNac.addEventListener("change", function () {
            const val = this.value;
            if (!val) {
                resultadoEdad.textContent = "Selecciona una fecha para calcular tu edad.";
                return;
            }

            const nacimiento = new Date(val + "T00:00:00");
            const hoy = new Date();
            let edad = hoy.getFullYear() - nacimiento.getFullYear();
            const diffMes = hoy.getMonth() - nacimiento.getMonth();

            if (diffMes < 0 || (diffMes === 0 && hoy.getDate() < nacimiento.getDate())) {
                edad--;
            }

            if (edad >= 18) {
                resultadoEdad.innerHTML = `<span style="color: green; font-weight: bold;">✓ Mayor de edad (${edad} años)</span>`;
            } else {
                resultadoEdad.innerHTML = `<span style="color: red; font-weight: bold;">⚠ Menor de edad (${edad} años)</span>`;
            }
        });
    }
});

// Limpia el borde rojo al escribir o corregir la casilla
function limpiarErrorInput(input) {
    const container = input.closest(".input-with-icon");
    if (container) {
        if (input.value.trim() !== "") {
            container.classList.add("filled");
            container.classList.remove("error-border");
        } else {
            container.classList.remove("filled");
        }
    }
}

// Función que revisa si el paso indicado tiene todos sus campos obligatorios llenos
function validarPasoActual(paso) {
    const pasoElemento = document.getElementById(`wizard-step-${paso}`);
    if (!pasoElemento) return true;

    // Obtener todos los campos que tengan 'required' o los checkboxes obligatorios del paso actual
    const camposRequeridos = pasoElemento.querySelectorAll("input[required], select[required], textarea[required]");
    let pasoValido = true;

    camposRequeridos.forEach(campo => {
        const contenedor = campo.closest(".input-with-icon") || campo.parentElement;
        
        // Validación para inputs de texto, correo, select, etc.
        if (campo.type !== "checkbox" && campo.value.trim() === "") {
            pasoValido = false;
            if (contenedor.classList.contains("input-with-icon")) {
                contenedor.classList.add("error-border");
                contenedor.classList.remove("filled");
            } else {
                campo.style.borderBottom = "2px solid #ef4444";
            }
        } 
        // Validación específica para Checkbox obligatorios (como términos en el paso 4)
        else if (campo.type === "checkbox" && !campo.checked) {
            pasoValido = false;
            campo.style.outline = "2px solid #ef4444";
        } else {
            if (contenedor.classList.contains("input-with-icon")) {
                contenedor.classList.remove("error-border");
            } else {
                campo.style.borderBottom = "";
                campo.style.outline = "";
            }
        }
    });

    if (!pasoValido) {
        // Coloca el cursor directamente en la primera casilla vacía obligatoria del paso
        const primerInvalido = pasoElemento.querySelector(".error-border input, .error-border select, input[required]:invalid");
        if (primerInvalido) primerInvalido.focus();
    }

    return pasoValido;
}

// Navegación al pulsar las esferas/pestañas superiores
function irAlPaso(paso) {
    // Si intenta saltar hacia un paso posterior, debe tener completado el paso en el que se encuentra actualmente
    if (paso > pasoActual) {
        for (let i = pasoActual; i < paso; i++) {
            if (!validarPasoActual(i)) {
                return; // Bloquea el avance si falta algún campo en el paso actual
            }
        }
    }
    pasoActual = paso;
    actualizarVistaWizard();
}

// Navegación al pulsar el botón "Siguiente →" / "Enviar solicitud ✓"
function pasoSiguiente() {
    // 1. Validar el paso actual antes de intentar pasar al siguiente
    if (!validarPasoActual(pasoActual)) {
        return; // Detiene la ejecución si hay casillas incompletas
    }

    // 2. Si no es el último paso, avanza al siguiente
    if (pasoActual < 4) {
        pasoActual++;
        actualizarVistaWizard();
    } 
    // 3. Si está en el paso 4 y todo está correcto, procesa el envío
    else {
        alert("¡Todos los campos del registro están completos! Solicitud enviada con éxito.");
    }
}

function pasoAnterior() {
    if (pasoActual > 1) {
        pasoActual--;
        actualizarVistaWizard();
    }
}

function actualizarVistaWizard() {
    // Muestra únicamente la sección del paso activo
    document.querySelectorAll(".wizard-step").forEach((step, index) => {
        if (index + 1 === pasoActual) {
            step.classList.add("active");
        } else {
            step.classList.remove("active");
        }
    });

    // Actualiza la barra y los círculos (01, 02, 03, 04)
    for (let i = 1; i <= 4; i++) {
        const stepBtn = document.getElementById(`step-btn-${i}`);
        if (i < pasoActual) {
            stepBtn.classList.add("completed");
            stepBtn.classList.remove("active");
        } else if (i === pasoActual) {
            stepBtn.classList.add("active");
            stepBtn.classList.remove("completed");
        } else {
            stepBtn.classList.remove("active", "completed");
        }
    }

    // Cambia el texto del botón en el último paso
    const btnAnterior = document.getElementById("btnAnterior");
    const btnSiguiente = document.getElementById("btnSiguiente");

    if (btnAnterior) {
        btnAnterior.style.display = (pasoActual === 1) ? "none" : "inline-block";
    }

    if (btnSiguiente) {
        btnSiguiente.textContent = (pasoActual === 4) ? "Enviar solicitud ✓" : "Siguiente →";
    }
}

function limpiarCampos() {
    document.getElementById("registroForm").reset();
    document.querySelectorAll(".input-with-icon").forEach(el => {
        el.classList.remove("filled", "error-border");
    });
    const resultadoEdad = document.getElementById("resultadoEdad");
    if (resultadoEdad) {
        resultadoEdad.textContent = "Selecciona una fecha para calcular tu edad.";
    }
}