console.log("Hola Mundo , desde JavaScript")
// VALIDACIÓN DE FECHA DE NACIMIENTO Y EDAD

// Obtener elementos del HTML
const fechaNacimiento = document.getElementById("fechaNacimiento");
const resultadoEdad = document.getElementById("resultadoEdad");

// Detectar cuando se selecciona una fecha
fechaNacimiento.addEventListener("change", function () {

    // Obtener fecha ingresada
    const valorFecha = this.value;

    // Limpiar mensaje anterior
    resultadoEdad.innerHTML = "";

    if (!valorFecha) {
        return;
    }

    // Convertir fecha de nacimiento
    const nacimiento = new Date(valorFecha + "T00:00:00");

    // Obtener fecha actual
    const hoy = new Date();

    // Validar fecha futura o incorrecta
    if (isNaN(nacimiento.getTime()) || nacimiento > hoy) {
        resultadoEdad.innerHTML =
            "Ingrese una fecha de nacimiento válida.";

        resultadoEdad.style.color = "red";
        return;
    }

    // Calcular edad
    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const diferenciaMes =
        hoy.getMonth() - nacimiento.getMonth();

    if (
        diferenciaMes < 0 ||
        (diferenciaMes === 0 &&
         hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    // Mostrar resultado
    if (edad >= 18) {

        resultadoEdad.innerHTML =
            "✓ El usuario es MAYOR DE EDAD. Tiene " +
            edad + " años.";

        resultadoEdad.style.color = "green";

    } else {

        resultadoEdad.innerHTML =
            "⚠ El usuario es MENOR DE EDAD. Tiene " +
            edad + " años.";

        resultadoEdad.style.color = "red";
    }

});
