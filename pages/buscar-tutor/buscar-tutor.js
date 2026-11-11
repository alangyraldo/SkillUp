// Los tutores vienen de js/tutores.js (se carga antes que este archivo)

const POR_PAGINA = 3;
let paginaActual = 1;

const lista = document.getElementById("listaTutores");
const paginacion = document.getElementById("paginacion");
const parametrosURL = new URLSearchParams(window.location.search);

let tutorIdSeleccionado = parametrosURL.get("tutorId");
let nombreTutorSeleccionado = parametrosURL.get("tutor");
let idTutoriaSeleccionada = parametrosURL.get("id");
let tipoURL = parametrosURL.get("tipo"); 

const inputBuscar = document.getElementById("inputBuscar");
const filtros = {
  busqueda: document.getElementById("filtroBusqueda"),
  materia: document.getElementById("filtroMateria"),
  nivel: document.getElementById("filtroNivel"),
  precio: document.getElementById("filtroPrecio"),
  modalidad: document.getElementById("filtroModalidad")
};

// Si venimos desde el panel de administración, forzamos el select correspondiente
if ((tipoURL === "tutoria" || idTutoriaSeleccionada) && filtros.busqueda) {
  filtros.busqueda.value = "tutoria";
} else if ((tutorIdSeleccionado || nombreTutorSeleccionado) && filtros.busqueda) {
  filtros.busqueda.value = "tutor";
}

// Limpiamos la URL inmediatamente para que no persista si recarga
if (idTutoriaSeleccionada || tutorIdSeleccionado || nombreTutorSeleccionado || tipoURL) {
  window.history.replaceState({}, document.title, window.location.pathname);
}

const formatoCOP = (n) => "$ " + n.toLocaleString("es-CO");

function filtrarElementos() {
  const texto = inputBuscar.value.trim().toLowerCase();
  const tipoFiltro = filtros.busqueda ? filtros.busqueda.value : "tutor";

  if (tipoFiltro === "tutoria") {
    const tutoriasGuardadas = JSON.parse(localStorage.getItem("tutorias")) || [];
    return tutoriasGuardadas.filter((t) => {
      const nombreTutor = t.tutor || t.nombre || "";
      const materiaTutoria = t.materia || "";
      const nivelTutoria = t.nivel || "";
      const precioTutoria = Number(t.precio || 0);
      const modalidadTutoria = t.modalidad || "";

      const coincideTexto = !texto || nombreTutor.toLowerCase().includes(texto) || materiaTutoria.toLowerCase().includes(texto);
      const coincideMateria = !filtros.materia.value || materiaTutoria.trim().toLowerCase() === filtros.materia.value.trim().toLowerCase();
      const coincideNivel = !filtros.nivel.value || nivelTutoria === filtros.nivel.value;
      const coincidePrecio = !filtros.precio.value || precioTutoria <= Number(filtros.precio.value);
      const coincideModalidad = !filtros.modalidad.value || modalidadTutoria === filtros.modalidad.value;

      return coincideTexto && coincideMateria && coincideNivel && coincidePrecio && coincideModalidad;
    });
  } else {
    return tutores.filter((t) => {
      const coincideTexto = !texto || t.nombre.toLowerCase().includes(texto) || t.materia.toLowerCase().includes(texto);
      const coincideMateria = !filtros.materia.value || t.materia === filtros.materia.value;
      const coincideNivel = !filtros.nivel.value || t.nivel === filtros.nivel.value;
      const coincidePrecio = !filtros.precio.value || t.precio <= Number(filtros.precio.value);
      const coincideModalidad = !filtros.modalidad.value || t.modalidad === filtros.modalidad.value;
      return coincideTexto && coincideMateria && coincideNivel && coincidePrecio && coincideModalidad;
    });
  }
}

// 1. Función para crear la tarjeta visual de una Tutoría guardada en LocalStorage
function crearCardTutoria(t) {
  return `
  <article class="tutor-card" data-id="${t.id}">
    <img class="tutor-card__foto" src="${t.foto}" alt="Foto de ${t.tutor}">
    <h3 class="tutor-card__nombre">${t.titulo}</h3>
    <div class="tutor-card__fila">
      <div>
        <p class="tutor-card__materia">${t.materia}</p>
        <p class="tutor-card__desde">Tutor</p>
        <p class="tutor-card__tutor">${t.tutor}</p>
        <p class="tutor-card__desde">Precio</p>
        <p class="tutor-card__precio">
          ${t.precio ? formatoCOP(Number(t.precio)) : '$ 0'}
        </p>
      </div>

      <div class="tutor-card__accion">
          <span class="tutor-card__disponible">
          ${Number(t.cupos) > 0 ? 'Disponible' : 'Sin cupos'}
          </span>
          <button type="button" class="tutor-card__boton" data-reservar="${t.id}">Reservar</button>
      </div>
    </div>
  </article>`;
}

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
    <article class="tutor-card" data-id="${t.id}" data-nombre="${t.nombre.toLowerCase().trim()}">
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
    b.addEventListener("click", () => { 
      // Al cambiar de página, limpiamos cualquier selección previa para liberar la vista
      idTutoriaSeleccionada = null;
      tutorIdSeleccionado = null;
      nombreTutorSeleccionado = null;
      paginaActual = pagina; 
      render(); 
    });
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

lista.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-reservar]");
  if (!boton) return;

  const sesion = obtenerSesion();
  if (!sesion) {
    alert("Inicia sesión para reservar una tutoría.");
    window.location.href = "../../pages/iniciar-sesion/index.html";
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

window.addEventListener("cupos:cambio", render);

function render() {
  const tipoFiltro = filtros.busqueda ? filtros.busqueda.value : "tutor";
  const resultado = filtrarElementos();
  const totalPaginas = Math.ceil(resultado.length / POR_PAGINA);
  
  if (paginaActual > totalPaginas) {
    paginaActual = 1;
  }

  // Calcular la página exacta basándonos en el ID o Nombre SOLO si hay selección activa
  if (idTutoriaSeleccionada && tipoFiltro === "tutoria" && paginaActual === 1) {
    const tutoriasGuardadas = JSON.parse(localStorage.getItem("tutorias")) || [];
    const index = tutoriasGuardadas.findIndex(t => String(t.id) === String(idTutoriaSeleccionada));
    if (index !== -1) {
      paginaActual = Math.floor(index / POR_PAGINA) + 1;
    }
  } else if ((tutorIdSeleccionado || nombreTutorSeleccionado) && tipoFiltro !== "tutoria" && paginaActual === 1) {
    const index = tutores.findIndex(t => 
      (tutorIdSeleccionado && String(t.id) === String(tutorIdSeleccionado)) || 
      (nombreTutorSeleccionado && t.nombre.toLowerCase().trim() === nombreTutorSeleccionado.toLowerCase().trim())
    );
    if (index !== -1) {
      paginaActual = Math.floor(index / POR_PAGINA) + 1;
    }
  }

  const inicioCalculado = (paginaActual - 1) * POR_PAGINA;
  const pagina = resultado.slice(inicioCalculado, inicioCalculado + POR_PAGINA);

  if (pagina.length === 0) {
    lista.innerHTML = `<p class="tutores__vacio">No encontramos resultados con esos filtros. Prueba quitando alguno.</p>`;
    paginacion.innerHTML = "";
    return;
  }

  // Renderizamos las tarjetas de la página actual
  if (tipoFiltro === "tutoria") {
    lista.innerHTML = pagina.map(crearCardTutoria).join("");
  } else {
    lista.innerHTML = pagina.map(crearCard).join("");
  }

  crearPaginacion(totalPaginas);

  // RESALTAR Y HACER SCROLL A LA TARJETA SELECCIONADA (Solo si las variables de selección siguen activas)
  if (idTutoriaSeleccionada) {
    const tarjeta = lista.querySelector(`[data-id="${idTutoriaSeleccionada}"]`);
    if (tarjeta) {
      tarjeta.classList.add("tutor-card--seleccionado");
      tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } else if (tutorIdSeleccionado) {
    const tarjeta = lista.querySelector(`[data-id="${tutorIdSeleccionado}"]`);
    if (tarjeta) {
      tarjeta.classList.add("tutor-card--seleccionado");
      tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } else if (nombreTutorSeleccionado) {
    const tarjetas = lista.querySelectorAll(".tutor-card");
    tarjetas.forEach(tarjeta => {
      const nombreEl = tarjeta.querySelector(".tutor-card__nombre");
      if (nombreEl && nombreEl.textContent.toLowerCase().trim() === nombreTutorSeleccionado.toLowerCase().trim()) {
        tarjeta.classList.add("tutor-card--seleccionado");
        tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
}

// Eventos
document.getElementById("formBuscador").addEventListener("submit", (e) => {
  e.preventDefault();
  // Al buscar, limpiamos la selección previa
  idTutoriaSeleccionada = null;
  tutorIdSeleccionado = null;
  nombreTutorSeleccionado = null;
  paginaActual = 1;
  render();
});

Object.values(filtros).forEach((select) =>
  select.addEventListener("change", () => { 
    // Al cambiar cualquier filtro, limpiamos la selección previa
    idTutoriaSeleccionada = null;
    tutorIdSeleccionado = null;
    nombreTutorSeleccionado = null;
    paginaActual = 1; 
    render(); 
  })
);

document.getElementById("btnLimpiar").addEventListener("click", () => {
  Object.values(filtros).forEach((s) => (s.value = ""));
  inputBuscar.value = "";
  idTutoriaSeleccionada = null;
  tutorIdSeleccionado = null;
  nombreTutorSeleccionado = null;
  paginaActual = 1;
  render();
});

render();

window.addEventListener("storage", evento => {
  if (evento.key === "skillup_tutores" || evento.key === "tutorias") {
    paginaActual = 1;
    render();
  }
});

window.addEventListener("tutorias:cambio", () => {
  if (typeof sincronizarTutoresDesdeStorage === "function") {
    sincronizarTutoresDesdeStorage();
  }
  paginaActual = 1;
  render();
});