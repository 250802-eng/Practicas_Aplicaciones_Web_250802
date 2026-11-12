    let pasoActual = 1;
    const totalPasos = 4;

    // Expresiones regulares profesionales
    const REGEX = {
        soloLetras: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{2,}$/,
        soloLetrasOpcional: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]*$/,
        correo: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        telefono: /^\d{10,15}$/,
        usuario: /^[a-zA-Z0-9_]{4,20}$/,
        passwordFuerte: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,32}$/,
        codigoPostal: /^\d{5}$/,
        url: /^https?:\/\/.+\..+/
    };

    // Bloqueo de caracteres inválidos en tiempo real mientras se escribe
    document.addEventListener('DOMContentLoaded', () => {
        // Solo números en teléfono y código postal
        ['numTelefonico', 'codigoPostal'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => {
                    el.value = el.value.replace(/\D/g, '');
                    validarCampoIndividual(id);
                });
            }
        });

        // Solo letras en nombres y ubicaciones geográficas
        ['nombre', 'apPaterno', 'apMaterno', 'pais', 'estado', 'ciudad'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => {
                    el.value = el.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                    validarCampoIndividual(id);
                });
            }
        });

        // Sin espacios en usuario y correo
        ['user', 'email'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => {
                    el.value = el.value.replace(/\s/g, '');
                    validarCampoIndividual(id);
                });
            }
        });

        // Validación en vivo de contraseñas, fecha y dirección
        ['fechaNacimiento', 'genero', 'password', 'confirmarPassword', 'direccion'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', () => validarCampoIndividual(id));
                el.addEventListener('change', () => validarCampoIndividual(id));
            }
        });

        // Limitar fecha máxima a hoy
        const hoy = new Date().toISOString().split('T')[0];
        document.getElementById('fechaNacimiento').setAttribute('max', hoy);
    });

    function marcarEstado(idCampo, esValido, mensajeError = '') {
        const wrap = document.getElementById('wrap-' + idCampo);
        const hint = document.getElementById('err-' + idCampo);
        if (!wrap) return esValido;

        wrap.classList.remove('error-border', 'valid-border');
        if (hint) hint.classList.remove('error-text');

        if (esValido) {
            wrap.classList.add('valid-border');
            if (hint && mensajeError) hint.textContent = mensajeError;
        } else {
            wrap.classList.add('error-border');
            if (hint) {
                hint.classList.add('error-text');
                if (mensajeError) hint.textContent = mensajeError;
            }
        }
        return esValido;
    }

    function calcularEdad(fechaStr) {
        const hoy = new Date();
        const nac = new Date(fechaStr + 'T00:00:00');
        let edad = hoy.getFullYear() - nac.getFullYear();
        const mes = hoy.getMonth() - nac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nac.getDate())) edad--;
        return edad;
    }

    function validarCampoIndividual(id) {
        const el = document.getElementById(id);
        if (!el) return true;
        const val = el.value.trim();

        switch (id) {
            case 'nombre':
                return marcarEstado(id, REGEX.soloLetras.test(val), val.length < 2 ? 'El nombre es obligatorio (mín. 2 letras).' : 'Nombre válido.');
            case 'apPaterno':
                return marcarEstado(id, REGEX.soloLetras.test(val), val.length < 2 ? 'El apellido paterno es obligatorio (mín. 2 letras).' : 'Apellido válido.');
            case 'apMaterno':
                if (val === '') {
                    document.getElementById('wrap-apMaterno').classList.remove('error-border', 'valid-border');
                    return true;
                }
                return marcarEstado(id, REGEX.soloLetras.test(val), val.length < 2 ? 'Debe tener al menos 2 letras.' : 'Apellido válido.');
            case 'genero':
                return marcarEstado(id, val !== '', val === '' ? 'Debes seleccionar una opción.' : 'Género seleccionado.');
            case 'fechaNacimiento':
                const boxEdad = document.getElementById('resultadoEdad');
                if (!val) {
                    boxEdad.textContent = 'Selecciona una fecha para calcular tu edad.';
                    return marcarEstado(id, false, 'La fecha de nacimiento es obligatoria.');
                }
                const edad = calcularEdad(val);
                if (edad < 18 || edad > 110) {
                    boxEdad.textContent = `Edad calculada: ${edad} años (No cumple el requisito de mayoría de edad).`;
                    return marcarEstado(id, false, 'Debes tener entre 18 y 110 años para registrarte.');
                }
                boxEdad.textContent = `Edad calculada: ${edad} años (Cumple requisito).`;
                return marcarEstado(id, true, 'Fecha de nacimiento válida.');
            case 'email':
                return marcarEstado(id, REGEX.correo.test(val), !REGEX.correo.test(val) ? 'Ingresa un correo válido (ejemplo@dominio.com).' : 'Correo electrónico válido.');
            case 'numTelefonico':
                return marcarEstado(id, REGEX.telefono.test(val), !REGEX.telefono.test(val) ? `Tiene ${val.length} dígitos. Debe tener entre 10 y 15 números.` : 'Teléfono válido.');
            case 'user':
                return marcarEstado(id, REGEX.usuario.test(val), !REGEX.usuario.test(val) ? 'Usa de 4 a 20 caracteres (solo letras, números o _).' : 'Usuario disponible.');
            case 'password':
                const okPass = REGEX.passwordFuerte.test(val);
                if (document.getElementById('confirmarPassword').value !== '') validarCampoIndividual('confirmarPassword');
                return marcarEstado(id, okPass, !okPass ? 'Requiere 8+ caracteres, 1 mayúscula, 1 minúscula y 1 número.' : 'Contraseña segura.');
            case 'confirmarPassword':
                const passOriginal = document.getElementById('password').value;
                const coincide = val !== '' && val === passOriginal;
                return marcarEstado(id, coincide, !coincide ? 'Las contraseñas no coinciden.' : 'Las contraseñas coinciden.');
            case 'direccion':
                return marcarEstado(id, val.length >= 5, val.length < 5 ? 'Ingresa una dirección completa (mín. 5 caracteres).' : 'Dirección válida.');
            case 'pais':
            case 'estado':
            case 'ciudad':
                return marcarEstado(id, val.length >= 3 && REGEX.soloLetras.test(val), 'Obligatorio: solo letras (mín. 3 caracteres).');
            case 'codigoPostal':
                return marcarEstado(id, REGEX.codigoPostal.test(val), !REGEX.codigoPostal.test(val) ? 'El código postal debe tener exactamente 5 números.' : 'Código postal válido.');
            default:
                return true;
        }
    }

    function validarPaso(paso) {
        let valido = true;

        if (paso === 1) {
            if (!validarCampoIndividual('nombre')) valido = false;
            if (!validarCampoIndividual('apPaterno')) valido = false;
            if (!validarCampoIndividual('apMaterno')) valido = false;
            if (!validarCampoIndividual('genero')) valido = false;
            if (!validarCampoIndividual('fechaNacimiento')) valido = false;
        } 
        else if (paso === 2) {
            if (!validarCampoIndividual('email')) valido = false;
            if (!validarCampoIndividual('numTelefonico')) valido = false;

            // Validar rango de horario si ambos están llenos
            const hIni = document.getElementById('horarioInicio').value;
            const hFin = document.getElementById('horarioFin').value;
            const errHorario = document.getElementById('err-horario');
            if (hIni && hFin && hFin <= hIni) {
                errHorario.textContent = 'La hora "Hasta" debe ser posterior a la hora "Desde".';
                errHorario.classList.add('error-text');
                valido = false;
            } else {
                errHorario.textContent = 'Opcional. La hora final debe ser mayor a la inicial.';
                errHorario.classList.remove('error-text');
            }

            // Validar URLs de redes sociales si están marcadas
            const errRedes = document.getElementById('err-redes');
            errRedes.textContent = '';
            if (document.getElementById('chkFb').checked) {
                const urlFb = document.getElementById('urlFb').value.trim();
                if (!REGEX.url.test(urlFb)) {
                    errRedes.textContent = 'Ingresa una URL válida para Facebook (ej. https://facebook.com/usuario).';
                    errRedes.classList.add('error-text');
                    valido = false;
                }
            }
            if (document.getElementById('chkIn').checked) {
                const urlIn = document.getElementById('urlIn').value.trim();
                if (!REGEX.url.test(urlIn)) {
                    errRedes.textContent = 'Ingresa una URL válida para LinkedIn (ej. https://linkedin.com/in/usuario).';
                    errRedes.classList.add('error-text');
                    valido = false;
                }
            }
        } 
        else if (paso === 3) {
            if (!validarCampoIndividual('user')) valido = false;
            if (!validarCampoIndividual('password')) valido = false;
            if (!validarCampoIndividual('confirmarPassword')) valido = false;
        } 
        else if (paso === 4) {
            if (!validarCampoIndividual('direccion')) valido = false;
            if (!validarCampoIndividual('pais')) valido = false;
            if (!validarCampoIndividual('estado')) valido = false;
            if (!validarCampoIndividual('ciudad')) valido = false;
            if (!validarCampoIndividual('codigoPostal')) valido = false;

            const terms = document.getElementById('terms');
            const errTerms = document.getElementById('err-terms');
            if (!terms.checked) {
                errTerms.textContent = 'Debes aceptar los términos y condiciones para finalizar.';
                errTerms.classList.add('error-text');
                valido = false;
            } else {
                errTerms.textContent = '';
            }
        }

        return valido;
    }

    function actualizarInterfazWizard() {
        for (let i = 1; i <= totalPasos; i++) {
            document.getElementById('wizard-step-' + i).classList.toggle('active', i === pasoActual);
            const btnStep = document.getElementById('step-btn-' + i);
            btnStep.classList.remove('active', 'completed');
            if (i === pasoActual) btnStep.classList.add('active');
            else if (i < pasoActual) btnStep.classList.add('completed');
        }

        document.getElementById('btnAnterior').style.visibility = (pasoActual === 1) ? 'hidden' : 'visible';
        const btnSig = document.getElementById('btnSiguiente');
        if (pasoActual === totalPasos) {
            btnSig.textContent = 'Finalizar registro ✓';
            btnSig.style.background = '#16a34a';
        } else {
            btnSig.textContent = 'Siguiente →';
            btnSig.style.background = '';
        }
    }

    function pasoSiguiente() {
        if (!validarPaso(pasoActual)) return;

        if (pasoActual < totalPasos) {
            pasoActual++;
            actualizarInterfazWizard();
        } else {
            document.getElementById('alertaFinal').style.display = 'block';
            alert('¡Usuario registrado exitosamente con todas las validaciones aprobadas!');
        }
    }

    function pasoAnterior() {
        if (pasoActual > 1) {
            pasoActual--;
            actualizarInterfazWizard();
        }
    }

    function intentarIrAlPaso(destino) {
        if (destino < pasoActual) {
            pasoActual = destino;
            actualizarInterfazWizard();
        } else if (destino > pasoActual) {
            // Solo deja avanzar si los pasos intermedios son válidos
            for (let p = pasoActual; p < destino; p++) {
                if (!validarPaso(p)) return;
            }
            pasoActual = destino;
            actualizarInterfazWizard();
        }
    }

    function limpiarCampos() {
        document.getElementById('registroForm').reset();
        document.querySelectorAll('.input-with-icon').forEach(w => w.classList.remove('error-border', 'valid-border'));
        document.querySelectorAll('.input-hint').forEach(h => h.classList.remove('error-text'));
        document.getElementById('resultadoEdad').textContent = 'Selecciona una fecha para calcular tu edad.';
        document.getElementById('alertaFinal').style.display = 'none';
        document.getElementById('urlFb').disabled = true;
        document.getElementById('urlIn').disabled = true;
        document.getElementById('qrPreviewContainer').innerHTML = '<i class="fa-regular fa-image"></i><p>Ningún archivo seleccionado</p>';
        pasoActual = 1;
        actualizarInterfazWizard();
    }

    function toggleRedSocial(chkId, inputId) {
        const activo = document.getElementById(chkId).checked;
        const input = document.getElementById(inputId);
        input.disabled = !activo;
        if (!activo) input.value = '';
    }

    function previsualizarQR(event) {
        const archivo = event.target.files[0];
        const cont = document.getElementById('qrPreviewContainer');
        if (!archivo) return;

        if (!archivo.type.startsWith('image/')) {
            alert('Solo se permiten archivos de imagen (PNG, JPG, WEBP).');
            event.target.value = '';
            return;
        }
        if (archivo.size > 2 * 1024 * 1024) {
            alert('La imagen del QR no debe superar los 2 MB.');
            event.target.value = '';
            return;
        }

        const lector = new FileReader();
        lector.onload = e => {
            cont.innerHTML = `<img src="${e.target.result}" alt="QR WhatsApp" style="max-width:110px; max-height:110px; border-radius:8px;">`;
        };
        lector.readAsDataURL(archivo);
    }
    // =========================================================
// AUTOCOMPLETADO DE UBICACIÓN CON window.MECAGEST_DOMICILIOS
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const catalogo = window.MECAGEST_DOMICILIOS;
    if (!catalogo) {
        console.warn('No se encontró window.MECAGEST_DOMICILIOS. Revisa la ruta ./data/domicilios.js');
        return;
    }

    const inputPais = document.getElementById('pais');
    const inputEstado = document.getElementById('estado');
    const inputCiudad = document.getElementById('ciudad');
    const inputCP = document.getElementById('codigoPostal');
    const inputDireccion = document.getElementById('direccion');

    const dlPaises = document.getElementById('listaPaises');
    const dlEstados = document.getElementById('listaEstados');
    const dlCiudades = document.getElementById('listaCiudades');
    const dlCP = document.getElementById('listaCP');
    const dlColonias = document.getElementById('listaColonias');

    // Función auxiliar para rellenar un <datalist> sin duplicados
    function llenarDatalist(datalistEl, valores) {
        if (!datalistEl) return;
        const unicos = [...new Set(valores.filter(Boolean))];
        datalistEl.innerHTML = unicos.map(v => `<option value="${v}">`).join('');
    }

    // 1. Cargar catálogos iniciales
    llenarDatalist(dlPaises, catalogo.paises || []);
    llenarDatalist(dlEstados, catalogo.estadosMexico || []);
    llenarDatalist(dlCiudades, (catalogo.ejemplosMexico || []).map(item => item.ciudad));
    llenarDatalist(dlCP, (catalogo.ejemplosMexico || []).map(item => item.cp));

    // 2. Al cambiar País -> Si es México, muestra estados; si es otro, limpia sugerencias de México
    inputPais.addEventListener('input', () => {
        const paisVal = inputPais.value.trim().toLowerCase();
        if (paisVal === 'méxico' || paisVal === 'mexico') {
            llenarDatalist(dlEstados, catalogo.estadosMexico || []);
        } else {
            dlEstados.innerHTML = '';
            dlCiudades.innerHTML = '';
            dlCP.innerHTML = '';
        }
    });

    // 3. Al seleccionar o escribir un Estado -> Filtra ciudades y CPs de ese estado
    inputEstado.addEventListener('change', () => {
        const estVal = inputEstado.value.trim().toLowerCase();
        const coincidencias = (catalogo.ejemplosMexico || []).filter(
            item => item.estado.toLowerCase() === estVal
        );

        if (coincidencias.length > 0) {
            if (!inputPais.value.trim()) {
                inputPais.value = 'México';
                validarCampoIndividual('pais');
            }
            llenarDatalist(dlCiudades, coincidencias.map(c => c.ciudad));
            llenarDatalist(dlCP, coincidencias.map(c => c.cp));
            llenarDatalist(dlColonias, coincidencias.map(c => `Col. ${c.colonia}`));

            // Si solo hay un ejemplo para ese estado, sugiere ciudad y CP si están vacíos
            if (coincidencias.length === 1) {
                if (!inputCiudad.value.trim()) {
                    inputCiudad.value = coincidencias[0].ciudad;
                    validarCampoIndividual('ciudad');
                }
                if (!inputCP.value.trim()) {
                    inputCP.value = coincidencias[0].cp;
                    validarCampoIndividual('codigoPostal');
                }
            }
        }
    });

    // 4. Al seleccionar una Ciudad -> Autocompleta Estado, País y CP
    inputCiudad.addEventListener('change', () => {
        const ciuVal = inputCiudad.value.trim().toLowerCase();
        const match = (catalogo.ejemplosMexico || []).find(
            item => item.ciudad.toLowerCase() === ciuVal
        );

        if (match) {
            inputPais.value = 'México';
            inputEstado.value = match.estado;
            inputCP.value = match.cp;
            llenarDatalist(dlColonias, [`Col. ${match.colonia}`]);

            validarCampoIndividual('pais');
            validarCampoIndividual('estado');
            validarCampoIndividual('codigoPostal');
        }
    });

    // 5. Al escribir/seleccionar un Código Postal de 5 dígitos -> Autocompleta todo
    inputCP.addEventListener('input', () => {
        const cpVal = inputCP.value.trim();
        if (cpVal.length === 5) {
            const match = (catalogo.ejemplosMexico || []).find(item => item.cp === cpVal);
            if (match) {
                inputPais.value = 'México';
                inputEstado.value = match.estado;
                inputCiudad.value = match.ciudad;
                llenarDatalist(dlColonias, [`Col. ${match.colonia}`]);

                if (!inputDireccion.value.trim() && match.colonia) {
                    inputDireccion.value = `Col. ${match.colonia}, `;
                    inputDireccion.focus();
                }

                validarCampoIndividual('pais');
                validarCampoIndividual('estado');
                validarCampoIndividual('ciudad');
                validarCampoIndividual('codigoPostal');
            }
        }
    });
});
