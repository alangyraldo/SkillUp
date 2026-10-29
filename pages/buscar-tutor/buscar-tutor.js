// Los tutores vienen de js/tutores.js (se carga antes que este archivo)

const POR_PAGINA = 3;
let paginaActual = 1;

const lista = document.getElementById("listaTutores");
const paginacion = document.getElementById("paginacion");
const parametrosURL = new URLSearchParams(window.location.search);
const nombreTutorSeleccionado = parametrosURL.get("tutor");
const inputBuscar = document.getElementById("inputBuscar");
const filtros = {
  materia: document.getElementById("filtroMateria"),
  nivel: document.getElementById("filtroNivel"),
  precio: document.getElementById("filtroPrecio"),
  modalidad: document.getElementById("filtroModalidad")
};

const formatoCOP = (n) => "$ " + n.toLocaleString("es-CO");

function filtrarTutores() {
  const texto = inputBuscar.value.trim().toLowerCase();
  return tutores.filter((t) => {
    const coincideTexto = !texto || t.nombre.toLowerCase().includes(texto) || t.materia.toLowerCase().includes(texto);
    const coincideMateria = !filtros.materia.value || t.materia === filtros.materia.value;
    const coincideNivel = !filtros.nivel.value || t.nivel === filtros.nivel.value;
    const coincidePrecio = !filtros.precio.value || t.precio <= Number(filtros.precio.value);
    const coincideModalidad = !filtros.modalidad.value || t.modalidad === filtros.modalidad.value;
    return coincideTexto && coincideMateria && coincideNivel && coincidePrecio && coincideModalidad;
  });
}
/*
function crearCard(t) {
  return `
    <article class="tutor-card">
      <img class="tutor-card__foto" src="${t.foto}" alt="Foto de ${t.nombre}">
      <p class="tutor-card__rating"><span class="tutor-card__estrella">★</span> (${t.resenas} reseñas)</p>
      <h3 class="tutor-card__nombre">${t.nombre}</h3>
      <div class="tutor-card__fila">
        <div>
          <p class="tutor-card__materia">${t.materia}</p>
          <p class="tutor-card__desde">Desde</p>
          <p class="tutor-card__precio">${formatoCOP(t.precio)}</p>
        </div>
        <div class="tutor-card__accion">
          <span class="tutor-card__disponible">Disponible hoy</span>
          <a class="tutor-card__boton" href="../perfil-tutor/index.html?tutor=${t.id}">Ver perfil</a>
        </div>
      </div>
    </article>`;
}
*/


function crearCupos(t) {
  const sesiones = Cupos.porTutor(t.nombre);
  if (!sesiones.length) {
    return `<p class="cupos-vacio">Sin tutorías programadas</p>`;
  }
  return `<ul class="cupos-lista">` + sesiones.map((s) => {
    const agotado = s.cupos <= 0;
    return `
      <li class="cupos-item ${agotado ? "cupos-item--agotado" : ""}">
        <span>${s.fecha} ${s.hora}</span>
        <strong>${agotado ? "Sin cupos" : s.cupos + " cupos"}</strong>
        <button type="button" class="cupos-item__btn" data-reservar="${s.id}">Reservar</button>
      </li>`;
  }).join("") + `</ul>`;
}

function crearCard(t) {
  return `
    <article class="tutor-card">
      <img class="tutor-card__foto" src="${t.foto}" alt="Foto de ${t.nombre}">
      <p class="tutor-card__rating"><span class="tutor-card__estrella">★</span> (${t.resenas} reseñas)</p>
      <h3 class="tutor-card__nombre">${t.nombre}</h3>
      <div class="tutor-card__fila">
        <div>
          <p class="tutor-card__materia">${t.materia}</p>
          <p class="tutor-card__desde">Desde</p>
          <p class="tutor-card__precio">${formatoCOP(t.precio)}</p>
        </div>
        <div class="tutor-card__accion">
          <span class="tutor-card__disponible">Disponible hoy</span>
          <a class="tutor-card__boton" href="../perfil-tutor/index.html?tutor=${t.id}">Ver perfil</a>
        </div>
      </div>
      ${crearCupos(t)}
    </article>`;
}


function crearPaginacion(totalPaginas) {
  paginacion.innerHTML = "";
  if (totalPaginas <= 1) return;

  const boton = (texto, pagina, { activo = false, deshabilitado = false } = {}) => {
    const b = document.createElement("button");
    b.textContent = texto;
    if (activo) b.classList.add("activo");
    b.disabled = deshabilitado;
    b.addEventListener("click", () => { paginaActual = pagina; render(); });
    return b;
  };

  paginacion.appendChild(boton("‹", paginaActual - 1, { deshabilitado: paginaActual === 1 }));
  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.appendChild(boton(i, i, { activo: i === paginaActual }));
  }
  paginacion.appendChild(boton("›", paginaActual + 1, { deshabilitado: paginaActual === totalPaginas }));
}

function mostrarModalSinCupos() {
  bootstrap.Modal.getOrCreateInstance(document.getElementById("modalSinCupos")).show();
}

// Clic en "Reservar": descuenta un cupo o avisa que ya no hay.
lista.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-reservar]");
  if (!boton) return;

  const sesion = obtenerSesion();
  if (!sesion) {
    alert("Inicia sesión para reservar una tutoría.");
    window.location.href = "/pages/iniciar-sesion/index.html";
    return;
  }
  if (sesion.rol === "admin") {
    alert("Entra con una cuenta de usuario para reservar.");
    return;
  }

  const resultado = Reservas.reservar(Number(boton.dataset.reservar), sesion.correo);
  if (resultado === "agotado") mostrarModalSinCupos();
  else if (resultado === "duplicada") alert("Ya reservaste esta tutoría.");
  else alert("¡Tutoría reservada! La verás en tu panel.");
}); 

// Si el admin cambia un cupo, la vista se actualiza sola.
window.addEventListener("cupos:cambio", render);

/*
function render() {
  const resultado = filtrarTutores();
  const totalPaginas = Math.ceil(resultado.length / POR_PAGINA);
  if (paginaActual > totalPaginas) paginaActual = 1;

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const pagina = resultado.slice(inicio, inicio + POR_PAGINA);

  lista.innerHTML = pagina.length
    ? pagina.map(crearCard).join("")
    : `<p class="tutores__vacio">No encontramos tutores con esos filtros. Prueba quitando alguno.</p>`;

  crearPaginacion(totalPaginas);
}*/

function render() {
  // Si venimos desde el dashboard, buscamos únicamente el tutor seleccionado.
  if (nombreTutorSeleccionado) {
    const tutorSeleccionado = tutores.find(
      tutor =>
        tutor.nombre.toLowerCase() === nombreTutorSeleccionado.toLowerCase()
    );
    // Si existe el tutor, mostramos su tarjeta.
    if (tutorSeleccionado) {
      lista.innerHTML = crearCard(tutorSeleccionado);
      // Resaltamos la tarjeta seleccionada.
      const tarjeta = lista.querySelector(".tutor-card");
      tarjeta.classList.add("tutor-card--seleccionado");
      // Ocultamos la paginación porque solo mostramos una tarjeta.
      paginacion.innerHTML = "";
      // Terminamos aquí para no aplicar los filtros habituales.
      return;
    }
  }
  // Comportamiento habitual cuando se entra a buscar tutores.
  const resultado = filtrarTutores();
  const totalPaginas = Math.ceil(resultado.length / POR_PAGINA);
  if (paginaActual > totalPaginas) {
    paginaActual = 1;
  }
  const inicio = (paginaActual - 1) * POR_PAGINA;
  const pagina = resultado.slice(inicio, inicio + POR_PAGINA);
  lista.innerHTML = pagina.length
    ? pagina.map(crearCard).join("")
    : `<p class="tutores__vacio">
         No encontramos tutores con esos filtros. Prueba quitando alguno.
       </p>`;
  crearPaginacion(totalPaginas);
}


// Eventos
document.getElementById("formBuscador").addEventListener("submit", (e) => {
  e.preventDefault();
  paginaActual = 1;
  render();
});

Object.values(filtros).forEach((select) =>
  select.addEventListener("change", () => { paginaActual = 1; render(); })
);

document.getElementById("btnLimpiar").addEventListener("click", () => {
  Object.values(filtros).forEach((s) => (s.value = ""));
  inputBuscar.value = "";
  paginaActual = 1;
  render();
});

render();


// =========================================================================
// EVENTO SUBMIT: GUARDAR LA NUEVA TUTORÍA AL PRESIONAR EL BOTÓN DEL FORMULARIO
// =========================================================================

(() => {
  if (window.__tutoriasAdminCargadas) return;
  window.__tutoriasAdminCargadas = true;

  const TOTAL_BASE = 10;
  const SOLO_ULTIMA = false;

  const tutoriasAdmin = JSON.parse(localStorage.getItem("tutorias")) || [];
  if (typeof tutores === "undefined") return;

  let nuevas = tutoriasAdmin.filter((t) => Number(t.id) > TOTAL_BASE);
  if (SOLO_ULTIMA) nuevas = nuevas.slice(-1);
  if (!nuevas.length) return;

  nuevas.forEach((nueva) => {
    const nombre = nueva.tutor || "Tutor";
    tutores.push({
      id: "admin-" + nueva.id,
      nombre,
      materia: nueva.materia,
      nivel: nueva.nivel || "Principiante",
      precio: Number(nueva.precio || 45000),
      modalidad: nueva.modalidad || "En línea",
      foto: nueva.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&size=400&background=5b2bff&color=fff`,
      resenas: 0,
      calificacion: 5
    });
  });

  render();
})();

