const modal = document.getElementById("modal");
const abrirModal = document.getElementById("boton-nueva-tutoria");
const cerrarModal = document.getElementById("cerrarModal");
const cancelar = document.getElementById("cancelar");
const formulario = document.getElementById("formTutorias");
const listaTutorias = document.getElementById("listaTutorias");

let tutorias = JSON.parse(localStorage.getItem("tutorias")) || [];
let idTutoriaEnEdicion = null;
let tutorSeleccionadoActual = null; // Guardará el objeto del tutor actual

// Variables de Paginación para Tutorías en Admin (Máximo 5 por página)
const POR_PAGINA_ADMIN_TUTORIAS = 5;
let paginaActualAdminTutorias = 1;

// Función auxiliar para obtener los tutores registrados en el módulo de tutores
function obtenerTutoresRegistrados() {
  try {
    return JSON.parse(localStorage.getItem("skillup_tutores") || "[]");
  } catch (error) {
    return [];
  }
}

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

// 1. Cargar materias únicas desde los tutores registrados en localStorage
function cargarSelectMaterias() {
  const selectMateria = document.getElementById("materia");
  if (!selectMateria) return;

  const tutoresGuardados = obtenerTutoresRegistrados();
  const materiasUnicas = [...new Set(tutoresGuardados.map(t => t.materia))];
  
  selectMateria.innerHTML = '<option value="">Seleccionar materia</option>';
  materiasUnicas.forEach(materia => {
    const option = document.createElement("option");
    option.value = materia;
    option.textContent = materia;
    selectMateria.appendChild(option);
  });
}

// 2. Evento Materia -> Filtra los Tutores de esa materia desde localStorage
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

  const tutoresGuardados = obtenerTutoresRegistrados();
  const tutoresFiltrados = tutoresGuardados.filter(t => t.materia.toLowerCase() === materiaSeleccionada.toLowerCase());
  
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

  const tutoresGuardados = obtenerTutoresRegistrados();

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

  tutorSeleccionadoActual = tutoresGuardados.find(t => t.nombre === nombreTutor);

  if (tutorSeleccionadoActual) {
    selectNivel.innerHTML = `<option value="${tutorSeleccionadoActual.nivel}">${tutorSeleccionadoActual.nivel}</option>`;
    selectNivel.disabled = false;

    selectModalidad.innerHTML = `<option value="${tutorSeleccionadoActual.modalidad}">${tutorSeleccionadoActual.modalidad}</option>`;
    selectModalidad.disabled = false;

    selectDia.innerHTML = '<option value="">Seleccionar día</option>';
    if (tutorSeleccionadoActual.horarios && Array.isArray(tutorSeleccionadoActual.horarios)) {
      const diasUnicos = [...new Set(tutorSeleccionadoActual.horarios.map(h => h.dia))];
      diasUnicos.forEach(dia => {
        const option = document.createElement("option");
        option.value = dia;
        option.textContent = dia;
        selectDia.appendChild(option);
      });
    }
    selectDia.disabled = false;

    selectHora.innerHTML = '<option value="">Selecciona un día primero</option>';
    selectHora.disabled = true;

    if (inputPrecio) inputPrecio.value = tutorSeleccionadoActual.precio;
  }
});

// 4. Evento Día -> Carga las Horas exactas que tiene ese tutor en ese día
document.getElementById("dia").addEventListener("change", (e) => {
  const diaSeleccionado = e.target.value;
  const selectHora = document.getElementById("hora");

  selectHora.innerHTML = '<option value="">Seleccionar hora</option>';

  if (!diaSeleccionado || !tutorSeleccionadoActual || !tutorSeleccionadoActual.horarios) {
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

  document.getElementById("titulo").value = tutoria.titulo;
  document.getElementById("descripcion").value = tutoria.descripcion;
  document.getElementById("duracion").value = tutoria.duracion;
  document.getElementById("precio").value = tutoria.precio;
  document.getElementById("cupos").value = tutoria.cupos;

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
    fecha: document.getElementById("dia").value, 
    hora: document.getElementById("hora").value,
    duracion: Number(document.getElementById("duracion").value),
    modalidad: document.getElementById("modalidad").value,
    precio: Number(document.getElementById("precio").value),
    cupos: Number(document.getElementById("cupos").value),
    foto: tutorSeleccionadoActual ? tutorSeleccionadoActual.foto : ""
  };

  if (datosFormulario.precio < 0 || datosFormulario.cupos < 1) {
    alert("El precio no puede ser negativo y debe haber al menos un cupo.");
    return;
  }

  if (idTutoriaEnEdicion !== null) {
    tutorias = tutorias.map(t => t.id === idTutoriaEnEdicion ? { ...t, ...datosFormulario } : t);
  } else {
    const nuevaTutoria = {
      id: tutorias.length > 0 ? Math.max(...tutorias.map(t => t.id)) + 1 : 1,
      ...datosFormulario
    };
    tutorias.push(nuevaTutoria);
  }

  localStorage.setItem("tutorias", JSON.stringify(tutorias));
  mostrarTutorias();
  cerrarVentana();
}

// ELIMINAR TUTORIA
function eliminarTutoria(id) {
  const tutoriaEliminada = tutorias.find(t => String(t.id) === String(id));
  if (!tutoriaEliminada) return;

  tutorias = tutorias.filter(t => String(t.id) !== String(id));
  localStorage.setItem("tutorias", JSON.stringify(tutorias));
  mostrarTutorias();
  window.dispatchEvent(new CustomEvent("tutorias:cambio"));
}

// Función para crear la paginación visual (1, 2, 3...) de Tutorías en el Admin
function crearPaginacionAdminTutorias(totalPaginas) {
  let contenedorPaginacionAdmin = document.getElementById("paginacionAdminTutorias");
  
  if (!contenedorPaginacionAdmin) {
    contenedorPaginacionAdmin = document.createElement("div");
    contenedorPaginacionAdmin.id = "paginacionAdminTutorias";
    contenedorPaginacionAdmin.className = "paginacion";
    if (listaTutorias && listaTutorias.parentNode) {
      listaTutorias.parentNode.appendChild(contenedorPaginacionAdmin);
    }
  }

  contenedorPaginacionAdmin.innerHTML = "";
  if (totalPaginas <= 1) return;

  const boton = (texto, pagina, { activo = false, deshabilitado = false } = {}) => {
    const b = document.createElement("button");
    b.textContent = texto;
    if (activo) b.classList.add("activo");
    b.disabled = deshabilitado;
    b.addEventListener("click", () => { 
      paginaActualAdminTutorias = pagina; 
      mostrarTutorias(); 
    });
    return b;
  };

  contenedorPaginacionAdmin.appendChild(boton("‹", paginaActualAdminTutorias - 1, { deshabilitado: paginaActualAdminTutorias === 1 }));
  for (let i = 1; i <= totalPaginas; i++) {
    contenedorPaginacionAdmin.appendChild(boton(i, i, { activo: i === paginaActualAdminTutorias }));
  }
  contenedorPaginacionAdmin.appendChild(boton("›", paginaActualAdminTutorias + 1, { deshabilitado: paginaActualAdminTutorias === totalPaginas }));
}

// Mostrar tutorías con límite de 5 por página y paginación
function mostrarTutorias() {
  listaTutorias.replaceChildren();

  tutorias = JSON.parse(localStorage.getItem("tutorias")) || [];

  if (tutorias.length === 0) {
    listaTutorias.innerHTML = `<p class="sin-tutorias">No hay tutorías registradas.</p>`;
    const paginacionAdmin = document.getElementById("paginacionAdminTutorias");
    if (paginacionAdmin) paginacionAdmin.innerHTML = "";
    return;
  }

  // Cálculo de páginas
  const totalPaginas = Math.ceil(tutorias.length / POR_PAGINA_ADMIN_TUTORIAS);
  if (paginaActualAdminTutorias > totalPaginas) {
    paginaActualAdminTutorias = 1;
  }

  const inicio = (paginaActualAdminTutorias - 1) * POR_PAGINA_ADMIN_TUTORIAS;
  const tutoriasPagina = tutorias.slice(inicio, inicio + POR_PAGINA_ADMIN_TUTORIAS);

  tutoriasPagina.forEach((tutoria) => {
    if (!tutoria.titulo && !tutoria.materia) return;

    const tarjeta = document.createElement("div");
    tarjeta.className = "tutoria-card";

    const thumbnail = document.createElement("div");
    thumbnail.className = "tutoria-thumb";
    thumbnail.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;

    const titulo = document.createElement("span");
    titulo.className = "tutoria-titulo";
    titulo.textContent = tutoria.titulo || "Sin título";

    const tutor = document.createElement("span");
    tutor.className = "tutoria-tutor";
    tutor.textContent = tutoria.tutor || "Sin tutor";

    const badgeMateria = document.createElement("span");
    badgeMateria.className = "badge-materia";
    badgeMateria.textContent = tutoria.materia || "General";

    const precio = document.createElement("span");
    precio.className = "tutoria-precio";
    precio.textContent = `$${(Number(tutoria.precio) || 0).toLocaleString()}`;

    const badgeEstado = document.createElement("span");
    badgeEstado.className = "badge-estado";
    const sinCupos = (Number(tutoria.cupos) || 0) <= 0;
    badgeEstado.textContent = sinCupos ? "Sin cupos" : `Activa · ${tutoria.cupos} cupos`;
    badgeEstado.classList.toggle("badge-agotado", sinCupos);

    const acciones = document.createElement("div");
    acciones.className = "tutoria-acciones";

    const btnVer = document.createElement("button");
    btnVer.type = "button";
    btnVer.className = "btn-accion btn-ver";
    btnVer.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;

    btnVer.addEventListener("click", () => {
      const url = `/pages/buscar-tutor/index.html?id=${encodeURIComponent(tutoria.id)}&tutor=${encodeURIComponent(tutoria.tutor)}&tipo=tutoria`;
      window.location.href = url;
    });

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn-accion btn-editar";
    btnEditar.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

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

  // Renderizar la barra de paginación debajo de la lista
  crearPaginacionAdminTutorias(totalPaginas);
}

formulario.addEventListener("submit", capturarTutoria);

document.addEventListener("DOMContentLoaded", () => {
  cargarSelectMaterias();
  mostrarTutorias();
});

window.addEventListener("storage", (e) => {
  if (e.key === "tutorias") {
    mostrarTutorias();
  }
  if (e.key === "skillup_tutores") {
    cargarSelectMaterias();
  }
});

window.addEventListener("tutorias:cambio", () => {
  mostrarTutorias();
  cargarSelectMaterias();
});