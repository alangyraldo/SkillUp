const modal = document.getElementById("modal");
const abrirModal = document.getElementById("boton-nueva-tutoria");
const cerrarModal = document.getElementById("cerrarModal");
const cancelar = document.getElementById("cancelar");
const formulario = document.getElementById("formTutorias");
const listaTutorias = document.getElementById("listaTutorias");

let tutorias = JSON.parse(localStorage.getItem("tutorias")) || [];
let idTutoriaEnEdicion = null;
let tutorSeleccionadoActual = null; // Guardará el objeto del tutor actual

function abrirVentana() {
  modal.classList.remove("oculto");
  document.body.classList.add("modal-abierto");
  document.getElementById("titulo").focus();
}

function cerrarVentana() {
  modal.classList.add("oculto");
  document.body.classList.remove("modal-abierto");
  formulario.reset();
  idTutoriaEnEdicion = null;
  tutorSeleccionadoActual = null;

  // Restablecer estados bloqueados de los selects dependientes
  document.getElementById("tutor").innerHTML = '<option value="">Selecciona una materia primero</option>';
  document.getElementById("tutor").disabled = true;

  document.getElementById("nivel").innerHTML = '<option value="">Selecciona un tutor primero</option>';
  document.getElementById("nivel").disabled = true;

  document.getElementById("dia").innerHTML = '<option value="">Selecciona un tutor primero</option>';
  document.getElementById("dia").disabled = true;

  document.getElementById("hora").innerHTML = '<option value="">Selecciona un día primero</option>';
  document.getElementById("hora").disabled = true;

  document.getElementById("modalidad").innerHTML = '<option value="">Selecciona un tutor primero</option>';
  document.getElementById("modalidad").disabled = true;

  const modalTitulo = modal.querySelector(".modal-header h2");
  if (modalTitulo) modalTitulo.textContent = "Nueva tutoría";
}

abrirModal.addEventListener("click", abrirVentana);
cerrarModal.addEventListener("click", cerrarVentana);
cancelar.addEventListener("click", cerrarVentana);

modal.addEventListener("click", (evento) => {
  if (evento.target === modal) cerrarVentana();
});

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && !modal.classList.contains("oculto")) {
    cerrarVentana();
  }
});

// 1. Cargar materias únicas desde tutores.js
function cargarSelectMaterias() {
  const selectMateria = document.getElementById("materia");
  if (!selectMateria) return;

  if (typeof tutores !== "undefined" && Array.isArray(tutores)) {
    const materiasUnicas = [...new Set(tutores.map(t => t.materia))];
    selectMateria.innerHTML = '<option value="">Seleccionar materia</option>';
    materiasUnicas.forEach(materia => {
      const option = document.createElement("option");
      option.value = materia;
      option.textContent = materia;
      selectMateria.appendChild(option);
    });
  }
}

// 2. Evento Materia -> Filtra los Tutores de esa materia
document.getElementById("materia").addEventListener("change", (e) => {
  const materiaSeleccionada = e.target.value;
  const selectTutor = document.getElementById("tutor");
  const selectNivel = document.getElementById("nivel");
  const selectDia = document.getElementById("dia");
  const selectHora = document.getElementById("hora");
  const selectModalidad = document.getElementById("modalidad");

  // Resetear dependientes
  selectTutor.innerHTML = '<option value="">Seleccionar tutor</option>';
  selectTutor.disabled = !materiaSeleccionada;

  selectNivel.innerHTML = '<option value="">Selecciona un tutor primero</option>';
  selectNivel.disabled = true;

  selectDia.innerHTML = '<option value="">Selecciona un tutor primero</option>';
  selectDia.disabled = true;

  selectHora.innerHTML = '<option value="">Selecciona un día primero</option>';
  selectHora.disabled = true;

  selectModalidad.innerHTML = '<option value="">Selecciona un tutor primero</option>';
  selectModalidad.disabled = true;

  if (!materiaSeleccionada) return;

  const tutoresFiltrados = tutores.filter(t => t.materia.toLowerCase() === materiaSeleccionada.toLowerCase());
  tutoresFiltrados.forEach((t) => {
    const option = document.createElement("option");
    option.value = t.nombre;
    option.textContent = t.nombre;
    selectTutor.appendChild(option);
  });
});

// 3. Evento Tutor -> Carga Nivel, Modalidad, Días y Precio exactos del tutor
document.getElementById("tutor").addEventListener("change", (e) => {
  const nombreTutor = e.target.value;
  const selectNivel = document.getElementById("nivel");
  const selectDia = document.getElementById("dia");
  const selectHora = document.getElementById("hora");
  const selectModalidad = document.getElementById("modalidad");
  const inputPrecio = document.getElementById("precio");

  if (!nombreTutor) {
    selectNivel.innerHTML = '<option value="">Selecciona un tutor primero</option>';
    selectNivel.disabled = true;

    selectDia.innerHTML = '<option value="">Selecciona un tutor primero</option>';
    selectDia.disabled = true;

    selectHora.innerHTML = '<option value="">Selecciona un día primero</option>';
    selectHora.disabled = true;

    selectModalidad.innerHTML = '<option value="">Selecciona un tutor primero</option>';
    selectModalidad.disabled = true;

    tutorSeleccionadoActual = null;
    return;
  }

  tutorSeleccionadoActual = tutores.find(t => t.nombre === nombreTutor);

  if (tutorSeleccionadoActual) {
    // Nivel único del tutor
    selectNivel.innerHTML = `<option value="${tutorSeleccionadoActual.nivel}">${tutorSeleccionadoActual.nivel}</option>`;
    selectNivel.disabled = false;

    // Modalidad única del tutor
    selectModalidad.innerHTML = `<option value="${tutorSeleccionadoActual.modalidad}">${tutorSeleccionadoActual.modalidad}</option>`;
    selectModalidad.disabled = false;

    // Días disponibles del tutor
    selectDia.innerHTML = '<option value="">Seleccionar día</option>';
    const diasUnicos = [...new Set(tutorSeleccionadoActual.horarios.map(h => h.dia))];
    diasUnicos.forEach(dia => {
      const option = document.createElement("option");
      option.value = dia;
      option.textContent = dia;
      selectDia.appendChild(option);
    });
    selectDia.disabled = false;

    // Resetear hora hasta que elijan día
    selectHora.innerHTML = '<option value="">Selecciona un día primero</option>';
    selectHora.disabled = true;

    // Precio base del tutor
    if (inputPrecio) inputPrecio.value = tutorSeleccionadoActual.precio;
  }
});

// 4. Evento Día -> Carga las Horas exactas que tiene ese tutor en ese día
document.getElementById("dia").addEventListener("change", (e) => {
  const diaSeleccionado = e.target.value;
  const selectHora = document.getElementById("hora");

  selectHora.innerHTML = '<option value="">Seleccionar hora</option>';

  if (!diaSeleccionado || !tutorSeleccionadoActual) {
    selectHora.disabled = true;
    return;
  }

  const horasDelDia = tutorSeleccionadoActual.horarios.filter(h => h.dia === diaSeleccionado);

  horasDelDia.forEach(h => {
    const optionHora = document.createElement("option");
    optionHora.value = h.hora;
    optionHora.textContent = h.hora;
    selectHora.appendChild(optionHora);
  });

  selectHora.disabled = false;
});

// Preparar edición al hacer clic en el botón de editar
function prepararEdicion(tutoria) {
  idTutoriaEnEdicion = tutoria.id;

  const modalTitulo = modal.querySelector(".modal-header h2");
  if (modalTitulo) modalTitulo.textContent = "Editar tutoría";

  // Rellenar campos principales
  document.getElementById("titulo").value = tutoria.titulo;
  document.getElementById("descripcion").value = tutoria.descripcion;
  document.getElementById("duracion").value = tutoria.duracion;
  document.getElementById("precio").value = tutoria.precio;
  document.getElementById("cupos").value = tutoria.cupos;

  // Seleccionar materia y disparar eventos en cascada
  const selectMateria = document.getElementById("materia");
  selectMateria.value = tutoria.materia;
  selectMateria.dispatchEvent(new Event("change"));

  const selectTutor = document.getElementById("tutor");
  selectTutor.value = tutoria.tutor;
  selectTutor.dispatchEvent(new Event("change"));

  const selectDia = document.getElementById("dia");
  selectDia.value = tutoria.fecha;
  selectDia.dispatchEvent(new Event("change"));

  document.getElementById("hora").value = tutoria.hora;

  abrirVentana();
}

// Capturar datos para Guardar / Crear
function capturarTutoria(evento) {
  evento.preventDefault();

  const datosFormulario = {
    titulo: document.getElementById("titulo").value.trim(),
    materia: document.getElementById("materia").value,
    nivel: document.getElementById("nivel").value,
    descripcion: document.getElementById("descripcion").value.trim(),
    tutor: document.getElementById("tutor").value,
    fecha: document.getElementById("dia").value, // Guardamos el día seleccionado
    hora: document.getElementById("hora").value,
    duracion: Number(document.getElementById("duracion").value),
    modalidad: document.getElementById("modalidad").value,
    precio: Number(document.getElementById("precio").value),
    cupos: Number(document.getElementById("cupos").value)
  };

  if (datosFormulario.precio < 0 || datosFormulario.cupos < 1) {
    alert("El precio no puede ser negativo y debe haber al menos un cupo.");
    return;
  }

  if (idTutoriaEnEdicion !== null) {
    tutorias = tutorias.map(t => t.id === idTutoriaEnEdicion ? { ...t, ...datosFormulario } : t);
  } else {
    const nuevaTutoria = {
      //id: tutorSeleccionadoActual ? tutorSeleccionadoActual.id : (tutorias.length > 0 ? Math.max(...tutorias.map(t => t.id)) + 1 : 1),
      id: tutorias.length > 0 ? Math.max(...tutorias.map(t => t.id)) + 1 : 1,
      ...datosFormulario
    };
    tutorias.push(nuevaTutoria);
  }

  localStorage.setItem("tutorias", JSON.stringify(tutorias));
  mostrarTutorias();
  cerrarVentana();
}

/* Eliminar tutoría
function eliminarTutoria(id) {
  tutorias = tutorias.filter(t => t.id !== id);
  localStorage.setItem("tutorias", JSON.stringify(tutorias));
  mostrarTutorias();
}*/
//ELIMINAR TUTORIA
function eliminarTutoria(id) {
  // Busca la tutoría que se quiere eliminar.
  const tutoriaEliminada = tutorias.find(t => String(t.id) === String(id));

  // Detiene el proceso si no existe.
  if (!tutoriaEliminada) return;

  // Elimina únicamente la tutoría seleccionada.
  tutorias = tutorias.filter(t => String(t.id) !== String(id));

  // Guarda la lista actualizada.
  localStorage.setItem("tutorias", JSON.stringify(tutorias));

  // Actualiza la tabla del administrador.
  mostrarTutorias();

  // Notifica que cambió la disponibilidad de tutorías.
  window.dispatchEvent(new CustomEvent("tutorias:cambio"));
}
// ELIMINAR TUTOR


function eliminarTutor(tutorId) {
  // Recupera los tutores guardados.
  const lista = JSON.parse(localStorage.getItem("skillup_tutores") || "[]");

  // Busca el tutor seleccionado.
  const tutor = lista.find(t => String(t.id) === String(tutorId));

  // Detiene la eliminación si no existe.
  if (!tutor) return;

  // Solicita confirmación antes de eliminarlo.
  if (!confirm(`¿Eliminar a ${tutor.nombre} y todas sus tutorías?`)) return;

  // Elimina al tutor del catálogo.
  const actualizados = lista.filter(t => String(t.id) !== String(tutorId));

  // Elimina las tutorías asociadas a ese tutor.
  tutorias = tutorias.filter(t => t.tutor !== tutor.nombre);

  // Guarda los cambios.
  localStorage.setItem("skillup_tutores", JSON.stringify(actualizados));
  localStorage.setItem("tutorias", JSON.stringify(tutorias));

  // Actualiza el catálogo en memoria.
  if (typeof sincronizarTutoresDesdeStorage === "function") {
    sincronizarTutoresDesdeStorage();
  }

  // Actualiza la tabla del dashboard.
  mostrarTutorias();

  // Notifica los cambios.
  window.dispatchEvent(new CustomEvent("tutorias:cambio"));
}


// Mostrar las tutorías en pantalla
function mostrarTutorias() {
  listaTutorias.replaceChildren();

  if (tutorias.length === 0) {
    listaTutorias.innerHTML = `<p class="sin-tutorias">No hay tutorías registradas.</p>`;
    return;
  }

  tutorias.forEach((tutoria) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tutoria-card";

    const thumbnail = document.createElement("div");
    thumbnail.className = "tutoria-thumb";
    thumbnail.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;

    const titulo = document.createElement("span");
    titulo.className = "tutoria-titulo";
    titulo.textContent = tutoria.titulo;

    const tutor = document.createElement("span");
    tutor.className = "tutoria-tutor";
    tutor.textContent = tutoria.tutor;

    const badgeMateria = document.createElement("span");
    badgeMateria.className = "badge-materia";
    badgeMateria.textContent = tutoria.materia;

    const precio = document.createElement("span");
    precio.className = "tutoria-precio";
    precio.textContent = `$${tutoria.precio.toLocaleString()}`;

    const badgeEstado = document.createElement("span");
    badgeEstado.className = "badge-estado";
    const sinCupos = tutoria.cupos <= 0;
    badgeEstado.textContent = sinCupos ? "Sin cupos" : `Activa · ${tutoria.cupos} cupos`;
    badgeEstado.classList.toggle("badge-agotado", sinCupos);

    const acciones = document.createElement("div");
    acciones.className = "tutoria-acciones";

    const btnVer = document.createElement("button");
    btnVer.type = "button";
    btnVer.className = "btn-accion btn-ver";
    btnVer.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

    // funcionalidad del btnVer para redirigir a la página de búsqueda de tutor con el nombre del tutor como parámetro
    btnVer.addEventListener("click", () => {
      const url = `/pages/buscar-tutor/index.html?tutor=${encodeURIComponent(tutoria.tutor)}`;
      window.location.href = url;
    });

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn-accion btn-editar";
    btnEditar.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

    // Conectar correctamente el botón de editar
    btnEditar.addEventListener("click", () => prepararEdicion(tutoria));

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn-accion btn-eliminar";
    btnEliminar.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

    btnEliminar.addEventListener("click", () => eliminarTutoria(tutoria.id));

    acciones.append(btnVer, btnEditar, btnEliminar);
    tarjeta.append(thumbnail, titulo, tutor, badgeMateria, precio, badgeEstado, acciones);
    listaTutorias.appendChild(tarjeta);
  });
}

formulario.addEventListener("submit", capturarTutoria);

document.addEventListener("DOMContentLoaded", () => {
  cargarSelectMaterias();
  mostrarTutorias();
});

window.addEventListener("storage", (e) => {
  if (e.key === "tutorias") {
    tutorias = JSON.parse(e.newValue) || [];
    mostrarTutorias();
  }
});

// Recarga las tutorías cuando se registra un nuevo tutor
window.addEventListener("tutorias:cambio", () => {
  tutorias = JSON.parse(localStorage.getItem("tutorias") || "[]");
  mostrarTutorias();
});

