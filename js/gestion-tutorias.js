/* Gestiona tutores, horarios, reservas y cupos de SkillUp. */

// Encapsula la lógica para no crear variables globales innecesarias.
(function () {
    // Activa el modo estricto de JavaScript.
    "use strict";

    // Define las claves que se utilizarán en localStorage.
    const CLAVES = {
        TUTORES: "skillup_tutores", // Clave de los tutores y sus horarios.
        RESERVAS: "skillup_reservas" // Clave de las tutorías reservadas.
    };

    // Lee una clave de localStorage y devuelve un arreglo.
    function leerArreglo(clave) {
        try {
            const contenido = localStorage.getItem(clave); // Obtiene el texto almacenado.
            if (!contenido) return []; // Devuelve un arreglo si la clave no existe.
            const datos = JSON.parse(contenido); // Convierte el texto JSON en JavaScript.
            return Array.isArray(datos) ? datos : []; // Verifica que los datos sean un arreglo.
        } catch (error) {
            console.error(`Error leyendo ${clave}:`, error); // Registra el error en consola.
            throw new Error(`No fue posible leer los datos guardados: ${clave}.`); // Informa el fallo.
        }
    }

    // Convierte un arreglo de JavaScript en texto JSON y lo guarda.
    function guardarArreglo(clave, datos) {
        try {
            localStorage.setItem(clave, JSON.stringify(datos)); // Guarda los datos en el navegador.
        } catch (error) {
            console.error(`Error guardando ${clave}:`, error); // Muestra el error ocurrido.
            throw new Error("No fue posible guardar los datos en el navegador."); // Propaga el fallo.
        }
    }

    // Normaliza textos para compararlos sin distinguir mayúsculas.
    function normalizar(valor) {
        return String(valor ?? "").trim().toLocaleLowerCase("es"); // Convierte el valor en texto uniforme.
    }

    // Crea un identificador para tutores, horarios y reservas nuevos.
    function crearId(prefijo) {
        return `${prefijo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; // Genera un ID aproximado único.
    }

    // Carga los tutores iniciales sin reemplazar los cambios existentes.
    function inicializar() {
        const guardados = leerArreglo(CLAVES.TUTORES); // Lee los tutores actuales.

        if (typeof tutores === "undefined" || !Array.isArray(tutores)) {
            throw new Error("Carga js/tutores.js antes de gestion-tutorias.js."); // Verifica el orden de carga.
        }

        if (guardados.length === 0) {
            guardarArreglo(CLAVES.TUTORES, JSON.parse(JSON.stringify(tutores))); // Copia el catálogo inicial.
        } else {
            let huboCambios = false; // Indica si se agregaron tutores al catálogo guardado.

            tutores.forEach((tutorInicial) => {
                const existe = guardados.some((tutor) => tutor.id === tutorInicial.id); // Comprueba si ya existe.

                if (!existe) {
                    guardados.push(JSON.parse(JSON.stringify(tutorInicial))); // Agrega solo el tutor que falta.
                    huboCambios = true; // Marca que el catálogo cambió.
                }
            });

            if (huboCambios) guardarArreglo(CLAVES.TUTORES, guardados); // Guarda los tutores agregados.
        }

        if (localStorage.getItem(CLAVES.RESERVAS) === null) {
            guardarArreglo(CLAVES.RESERVAS, []); // Crea la lista de reservas si no existe.
        }
    }

    // Devuelve todos los tutores guardados.
    function obtenerTutores() {
        return leerArreglo(CLAVES.TUTORES); // Lee la lista actualizada.
    }

    // Busca un tutor por su ID y devuelve null si no existe.
    function obtenerTutorPorId(tutorId) {
        return obtenerTutores().find((tutor) => tutor.id === tutorId) ?? null; // Busca el tutor solicitado.
    }

    // Filtra los tutores que enseñan una materia determinada.
    function obtenerTutoresPorMateria(materia) {
        return obtenerTutores().filter((tutor) => normalizar(tutor.materia) === normalizar(materia)); // Compara las materias.
    }

    // Agrega un tutor nuevo al catálogo guardado.
    function agregarTutor(datos) {
        if (!datos?.nombre?.trim()) throw new Error("El nombre del tutor es obligatorio."); // Valida el nombre.
        if (!datos?.materia?.trim()) throw new Error("La materia del tutor es obligatoria."); // Valida la materia.

        const lista = obtenerTutores(); // Obtiene los tutores actuales.

        const nuevoTutor = {
            id: datos.id || crearId("tutor"), // Usa el ID recibido o crea uno nuevo.
            nombre: datos.nombre.trim(), // Guarda el nombre sin espacios externos.
            materia: datos.materia.trim(), // Guarda la materia sin espacios externos.
            nivel: datos.nivel || "Intermedio", // Asigna un nivel predeterminado.
            precio: Number(datos.precio) || 0, // Convierte el precio en número.
            experiencia: datos.experiencia || "Sin especificar", // Define la experiencia.
            modalidad: datos.modalidad || "En línea", // Define la modalidad predeterminada.
            foto: datos.foto || "", // Guarda la ruta de la foto si existe.
            rating: Number(datos.rating) || 0, // Guarda la calificación numérica.
            resenas: Number(datos.resenas) || 0, // Guarda la cantidad de reseñas.
            idiomas: Array.isArray(datos.idiomas) ? datos.idiomas : ["Español"], // Valida los idiomas.
            habilidades: Array.isArray(datos.habilidades) ? datos.habilidades : [], // Valida las habilidades.
            descripcion: datos.descripcion || "", // Guarda la descripción.
            horarios: [] // Inicializa los horarios del nuevo tutor.
        };

        if (lista.some((tutor) => tutor.id === nuevoTutor.id)) {
            throw new Error("Ya existe un tutor con ese identificador."); // Evita IDs repetidos.
        }

        (datos.horarios || []).forEach((horario) => {
            nuevoTutor.horarios.push(crearHorario(horario)); // Crea cada horario inicial.
        });

        lista.push(nuevoTutor); // Agrega el tutor al arreglo.
        guardarArreglo(CLAVES.TUTORES, lista); // Persiste el catálogo actualizado.
        return nuevoTutor; // Devuelve el tutor creado.
    }

    // Actualiza los datos generales de un tutor sin reemplazar sus horarios.
    function editarTutor(tutorId, cambios) {
        const lista = obtenerTutores(); // Obtiene el catálogo actual.
        const indice = lista.findIndex((tutor) => tutor.id === tutorId); // Busca la posición del tutor.

        if (indice === -1) throw new Error("No se encontró el tutor."); // Verifica que exista.

        const actual = lista[indice]; // Obtiene el tutor encontrado.

        const camposPermitidos = [
            "nombre", "materia", "nivel", "precio", "experiencia",
            "modalidad", "foto", "rating", "resenas", "idiomas",
            "habilidades", "descripcion"
        ]; // Limita los campos que se pueden editar.

        camposPermitidos.forEach((campo) => {
            if (cambios[campo] !== undefined) actual[campo] = cambios[campo]; // Actualiza solo los campos recibidos.
        });

        if (!actual.nombre?.trim() || !actual.materia?.trim()) {
            throw new Error("El tutor debe tener nombre y materia."); // Valida los campos obligatorios.
        }

        guardarArreglo(CLAVES.TUTORES, lista); // Guarda los cambios.
        return actual; // Devuelve el tutor actualizado.
    }

    // Construye un horario con su capacidad y disponibilidad inicial.
    function crearHorario(datos) {
        const cupos = Number(datos.cuposIniciales ?? 20); // Usa 20 cupos si no se especifican.

        if (!datos.dia?.trim() || !datos.hora?.trim()) {
            throw new Error("El día y la hora del horario son obligatorios."); // Valida el horario.
        }

        if (!Number.isInteger(cupos) || cupos < 0) {
            throw new Error("Los cupos iniciales deben ser un entero no negativo."); // Valida la capacidad.
        }

        return {
            id: datos.id || crearId("horario"), // Asigna un identificador al horario.
            dia: datos.dia.trim(), // Guarda el día de la semana.
            hora: datos.hora.trim(), // Guarda la hora.
            cuposIniciales: cupos, // Guarda la capacidad máxima.
            cuposDisponibles: Number(datos.cuposDisponibles ?? cupos), // Guarda los cupos actuales.
            activo: datos.activo !== false // Activa el horario salvo que se indique lo contrario.
        };
    }

    // Agrega una franja horaria a un tutor existente.
    function agregarHorario(tutorId, datosHorario) {
        const lista = obtenerTutores(); // Obtiene los tutores.
        const tutor = lista.find((item) => item.id === tutorId); // Busca al tutor.

        if (!tutor) throw new Error("No se encontró el tutor."); // Valida que el tutor exista.
        if (!Array.isArray(tutor.horarios)) tutor.horarios = []; // Inicializa los horarios si faltan.

        const duplicado = tutor.horarios.some((horario) =>
            normalizar(horario.dia) === normalizar(datosHorario.dia) &&
            normalizar(horario.hora) === normalizar(datosHorario.hora)
        ); // Comprueba si ya existe esa franja horaria.

        if (duplicado) {
            throw new Error("El tutor ya tiene un horario registrado para ese día y hora."); // Evita horarios duplicados.
        }

        const nuevoHorario = crearHorario(datosHorario); // Construye el nuevo horario.
        tutor.horarios.push(nuevoHorario); // Añade el horario al tutor.
        guardarArreglo(CLAVES.TUTORES, lista); // Guarda los cambios.
        return nuevoHorario; // Devuelve el horario creado.
    }

    // Modifica un horario y mantiene el número de reservas existentes.
    function editarHorario(tutorId, horarioId, cambios) {
        const lista = obtenerTutores(); // Obtiene el catálogo.
        const tutor = lista.find((item) => item.id === tutorId); // Busca al tutor.

        if (!tutor) throw new Error("No se encontró el tutor."); // Valida el tutor.

        const horario = (tutor.horarios || []).find((item) => item.id === horarioId); // Busca el horario.
        if (!horario) throw new Error("No se encontró el horario."); // Valida el horario.

        const cuposAnteriores = horario.cuposIniciales; // Guarda la capacidad anterior.
        const disponiblesAnteriores = horario.cuposDisponibles; // Guarda los cupos disponibles anteriores.

        if (cambios.dia !== undefined) horario.dia = String(cambios.dia).trim(); // Actualiza el día.
        if (cambios.hora !== undefined) horario.hora = String(cambios.hora).trim(); // Actualiza la hora.
        if (cambios.activo !== undefined) horario.activo = Boolean(cambios.activo); // Activa o desactiva la franja.

        if (cambios.cuposIniciales !== undefined) {
            const nuevosCupos = Number(cambios.cuposIniciales); // Convierte la nueva capacidad.

            if (!Number.isInteger(nuevosCupos) || nuevosCupos < 0) {
                throw new Error("Los cupos iniciales deben ser un entero no negativo."); // Valida la capacidad.
            }

            const reservasActuales = cuposAnteriores - disponiblesAnteriores; // Calcula cuántos cupos están reservados.

            if (nuevosCupos < reservasActuales) {
                throw new Error("La capacidad no puede ser menor que los cupos ya reservados."); // Evita perder reservas.
            }

            horario.cuposIniciales = nuevosCupos; // Actualiza la capacidad máxima.
            horario.cuposDisponibles = nuevosCupos - reservasActuales; // Calcula los cupos restantes.
        }

        const duplicado = tutor.horarios.some((item) =>
            item.id !== horarioId &&
            normalizar(item.dia) === normalizar(horario.dia) &&
            normalizar(item.hora) === normalizar(horario.hora)
        ); // Busca otra franja con el mismo día y hora.

        if (duplicado) throw new Error("Ya existe otro horario con ese día y hora."); // Evita duplicados.

        guardarArreglo(CLAVES.TUTORES, lista); // Persiste el horario actualizado.
        return horario; // Devuelve el horario modificado.
    }

    // Devuelve solo los horarios activos que tienen cupos.
    function obtenerHorariosDisponibles(tutorId) {
        const tutor = obtenerTutorPorId(tutorId); // Busca al tutor.
        if (!tutor) return []; // Devuelve una lista vacía si no existe.

        return (tutor.horarios || []).filter(
            (horario) => horario.activo && horario.cuposDisponibles > 0
        ); // Filtra los horarios reservables.
    }

    // Consulta la disponibilidad de todos los tutores de una materia.
    function obtenerDisponibilidadPorMateria(materia) {
        return obtenerTutoresPorMateria(materia).flatMap((tutor) =>
            (tutor.horarios || [])
                .filter((horario) => horario.activo && horario.cuposDisponibles > 0)
                .map((horario) => ({
                    tutorId: tutor.id, // Incluye el ID del tutor.
                    tutor: tutor.nombre, // Incluye el nombre del tutor.
                    materia: tutor.materia, // Incluye la materia.
                    precio: tutor.precio, // Incluye el precio.
                    horarioId: horario.id, // Incluye el ID del horario.
                    dia: horario.dia, // Incluye el día.
                    hora: horario.hora, // Incluye la hora.
                    cuposDisponibles: horario.cuposDisponibles // Incluye los cupos restantes.
                }))
        ); // Devuelve una lista plana de horarios disponibles.
    }

    // Devuelve todas las reservas almacenadas.
    function obtenerReservas() {
        return leerArreglo(CLAVES.RESERVAS); // Lee las reservas actuales.
    }

    // Registra una tutoría y descuenta un cupo del horario elegido.
    function reservarTutoria(datos) {
        if (!datos?.tutorId) throw new Error("Debes seleccionar un tutor."); // Valida la selección del tutor.

        const listaTutores = obtenerTutores(); // Obtiene los tutores actuales.
        const tutor = listaTutores.find((item) => item.id === datos.tutorId); // Busca al tutor seleccionado.

        if (!tutor) throw new Error("El tutor seleccionado no existe."); // Comprueba que el tutor exista.

        let horario; // Declara la variable que guardará el horario elegido.

        if (datos.horarioId) {
            horario = (tutor.horarios || []).find((item) => item.id === datos.horarioId); // Busca por ID.
        } else {
            horario = (tutor.horarios || []).find((item) =>
                normalizar(item.dia) === normalizar(datos.dia) &&
                normalizar(item.hora) === normalizar(datos.hora)
            ); // Busca por día y hora si no se envió un ID.
        }

        if (!horario) throw new Error("No se encontró el horario seleccionado para este tutor."); // Valida el horario.
        if (!horario.activo) throw new Error("Este horario no está activo."); // Impide reservar horarios inactivos.
        if (horario.cuposDisponibles <= 0) throw new Error("Este horario ya no tiene cupos disponibles."); // Impide sobrecupos.

        if (datos.materia && normalizar(datos.materia) !== normalizar(tutor.materia)) {
            throw new Error("La materia no coincide con el tutor seleccionado."); // Comprueba que la materia corresponda.
        }

        const reservas = obtenerReservas(); // Obtiene las reservas actuales.

        const reserva = {
            id: crearId("reserva"), // Genera el ID de la reserva.
            tutorId: tutor.id, // Guarda el ID del tutor.
            tutor: tutor.nombre, // Guarda el nombre del tutor.
            materia: tutor.materia, // Guarda la materia reservada.
            horarioId: horario.id, // Guarda el horario reservado.
            dia: horario.dia, // Guarda el día reservado.
            hora: horario.hora, // Guarda la hora reservada.
            precio: tutor.precio, // Guarda el precio de la tutoría.
            estudiante: datos.estudiante || "", // Guarda el nombre del estudiante.
            correo: datos.correo || "", // Guarda el correo del estudiante.
            descripcion: datos.descripcion || "", // Guarda las observaciones.
            estado: "Agendada", // Define el estado inicial de la reserva.
            fechaCreacion: new Date().toISOString() // Guarda la fecha de creación.
        };

        const cuposAnteriores = horario.cuposDisponibles; // Guarda los cupos antes del descuento.
        horario.cuposDisponibles -= 1; // Descuenta un cupo del horario seleccionado.

        try {
            guardarArreglo(CLAVES.TUTORES, listaTutores); // Guarda el nuevo número de cupos.
            reservas.push(reserva); // Añade la reserva a la lista.
            guardarArreglo(CLAVES.RESERVAS, reservas); // Guarda la lista de reservas.
        } catch (error) {
            horario.cuposDisponibles = cuposAnteriores; // Restaura los cupos en memoria si falla el guardado.
            try {
                guardarArreglo(CLAVES.TUTORES, listaTutores); // Intenta restaurar los cupos guardados.
            } catch (errorRestauracion) {
                console.error("No se pudo restaurar el cupo:", errorRestauracion); // Registra el fallo de restauración.
            }
            throw error; // Informa que la reserva no pudo completarse.
        }

        return {
            reserva, // Devuelve la reserva creada.
            cuposDisponibles: horario.cuposDisponibles // Devuelve los cupos restantes.
        };
    }

    // Convierte los campos del formulario en un objeto de datos.
    function obtenerValor(formData, nombres) {
        for (const nombre of nombres) {
            const valor = formData.get(nombre); // Obtiene el valor del campo.
            if (valor !== null && String(valor).trim() !== "") return String(valor).trim(); // Devuelve el primer valor válido.
        }
        return ""; // Devuelve texto vacío si no encuentra ningún campo.
    }

    // Obtiene los datos del formulario usando nombres de campo alternativos.
    function datosDesdeFormulario(formulario) {
        const formData = new FormData(formulario); // Lee los campos enviados por el formulario.

        let tutorId = obtenerValor(formData, ["tutorId", "idTutor", "tutor_id"]); // Busca el ID del tutor.
        const nombreTutor = obtenerValor(formData, ["tutor", "nombreTutor", "tutorNombre"]); // Busca el nombre del tutor.
        const materia = obtenerValor(formData, ["materia", "clase", "nombreClase"]); // Busca la materia.
        const horarioId = obtenerValor(formData, ["horarioId", "idHorario", "horario_id"]); // Busca el ID del horario.
        const dia = obtenerValor(formData, ["dia", "diaSemana", "diaTutoria"]); // Busca el día.
        const hora = obtenerValor(formData, ["hora", "horaTutoria", "horario"]); // Busca la hora.

        const lista = obtenerTutores(); // Obtiene el catálogo actual.

        if (!tutorId && nombreTutor) {
            const tutorEncontrado = lista.find((item) => normalizar(item.nombre) === normalizar(nombreTutor)); // Busca por nombre.
            tutorId = tutorEncontrado?.id || ""; // Recupera el ID si encuentra el tutor.
        }

        if (!tutorId && materia && (horarioId || (dia && hora))) {
            const candidatos = lista.filter((tutor) => {
                if (normalizar(tutor.materia) !== normalizar(materia)) return false; // Descarta otras materias.

                return (tutor.horarios || []).some((horario) => {
                    if (horarioId) return horario.id === horarioId; // Compara el ID del horario.
                    return normalizar(horario.dia) === normalizar(dia) &&
                        normalizar(horario.hora) === normalizar(hora); // Compara día y hora.
                });
            }); // Encuentra tutores que coinciden con la materia y el horario.

            if (candidatos.length === 1) tutorId = candidatos[0].id; // Selecciona el tutor solo si no hay ambigüedad.
        }

        return {
            tutorId, // Devuelve el ID del tutor.
            materia, // Devuelve la materia elegida.
            horarioId, // Devuelve el ID del horario.
            dia, // Devuelve el día elegido.
            hora, // Devuelve la hora elegida.
            estudiante: obtenerValor(formData, ["estudiante", "nombreEstudiante", "nombre"]), // Obtiene el estudiante.
            correo: obtenerValor(formData, ["correo", "email", "correoEstudiante"]), // Obtiene el correo.
            descripcion: obtenerValor(formData, ["descripcion", "observaciones", "comentarios"]) // Obtiene las observaciones.
        };
    }

    // Conecta el formulario de agendamiento con la función de reserva.
    function conectarFormulario() {
        const boton = document.getElementById("guardarTutoria"); // Busca el botón de envío.
        if (!boton) return; // Sale si esta página no contiene el botón.

        const formulario = boton.closest("form"); // Busca el formulario contenedor.
        if (!formulario) {
            console.warn('El botón "guardarTutoria" debe estar dentro de un formulario.'); // Informa si falta el formulario.
            return; // Detiene la conexión.
        }

        if (formulario.dataset.skillupReservasConectado === "true") return; // Evita conectar el mismo formulario dos veces.
        formulario.dataset.skillupReservasConectado = "true"; // Marca el formulario como conectado.

        formulario.addEventListener("submit", function (evento) {
            try {
                const datos = datosDesdeFormulario(formulario); // Lee los datos de la tutoría.
                const resultado = reservarTutoria(datos); // Registra la reserva y descuenta un cupo.

                formulario.dispatchEvent(new CustomEvent("skillup:tutoria-guardada", {
                    bubbles: true, // Permite que otros componentes detecten el evento.
                    detail: resultado // Incluye la reserva y los cupos restantes.
                }));

                console.info("Tutoría agendada correctamente:", resultado.reserva); // Informa que la reserva se guardó.
                console.info("Cupos restantes:", resultado.cuposDisponibles); // Muestra los cupos restantes.
            } catch (error) {
                evento.preventDefault(); // Cancela el envío si falla la reserva.
                evento.stopImmediatePropagation(); // Evita que otros listeners procesen el envío como exitoso.
                console.error("No se pudo agendar la tutoría:", error); // Registra el error.
                alert(error.message || "No se pudo guardar la tutoría."); // Informa el problema al usuario.
            }
        }, true); // Ejecuta este listener en la fase de captura.
    }

    // Expone las funciones para que otros componentes puedan utilizarlas.
    window.SkillUpTutorias = {
        inicializar, // Inicializa el catálogo y las reservas.
        obtenerTutores, // Consulta todos los tutores.
        obtenerTutorPorId, // Consulta un tutor por ID.
        obtenerTutoresPorMateria, // Filtra tutores por materia.
        agregarTutor, // Registra un tutor.
        editarTutor, // Edita los datos generales de un tutor.
        agregarHorario, // Agrega un horario.
        editarHorario, // Modifica un horario.
        obtenerHorariosDisponibles, // Consulta horarios de un tutor con cupos.
        obtenerDisponibilidadPorMateria, // Consulta horarios disponibles por materia.
        obtenerReservas, // Consulta las reservas.
        reservarTutoria, // Registra una reserva y descuenta un cupo.
        cancelarTutoria, // Cancela una reserva y recupera su cupo.
        conectarFormulario // Conecta el formulario de agendamiento.
    };

    inicializar(); // Carga los datos iniciales o conserva los existentes.

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", conectarFormulario); // Espera a que el HTML esté disponible.
    } else {
        conectarFormulario(); // Conecta el formulario si el HTML ya está cargado.
    }
})(); // Ejecuta inmediatamente la función principal.
