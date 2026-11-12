const POR_PAGINA = 3; // Define cuántas tarjetas se muestran por página.
let paginaActual = 1; // Guarda la página que se está visualizando.

const lista = document.getElementById("listaTutores"); // Obtiene el contenedor de las tarjetas.
const paginacion = document.getElementById("paginacion"); // Obtiene el contenedor de la paginación.
const parametrosURL = new URLSearchParams(window.location.search); // Obtiene los parámetros enviados por la URL.

let tutorIdSeleccionado = parametrosURL.get("tutorId"); // Obtiene el identificador del tutor seleccionado.
let nombreTutorSeleccionado = parametrosURL.get("tutor"); // Obtiene el nombre del tutor enviado por la URL.
let idTutoriaSeleccionada = parametrosURL.get("id"); // Obtiene el identificador de la tutoría seleccionada.
let tipoURL = parametrosURL.get("tipo"); // Obtiene el tipo de búsqueda solicitado.

const inputBuscar = document.getElementById("inputBuscar"); // Obtiene el campo de búsqueda.

const filtros = {
  busqueda: document.getElementById("filtroBusqueda"), // Obtiene el filtro por tipo de búsqueda.
  materia: document.getElementById("filtroMateria"), // Obtiene el filtro por materia.
  nivel: document.getElementById("filtroNivel"), // Obtiene el filtro por nivel.
  precio: document.getElementById("filtroPrecio"), // Obtiene el filtro por precio.
  modalidad: document.getElementById("filtroModalidad") // Obtiene el filtro por modalidad.
};

const modalHorarios = document.getElementById("modalHorarios"); // Obtiene la ventana emergente de horarios.

// Selecciona automáticamente el tipo de búsqueda según los parámetros recibidos.
if ((tipoURL === "tutoria" || idTutoriaSeleccionada) && filtros.busqueda) {
  filtros.busqueda.value = "tutoria";
} else if ((tutorIdSeleccionado || nombreTutorSeleccionado) && filtros.busqueda) {
  filtros.busqueda.value = "tutor";
}

// Limpia los parámetros de la URL después de obtener sus valores.
if (idTutoriaSeleccionada || tutorIdSeleccionado || nombreTutorSeleccionado || tipoURL) {
  window.history.replaceState({}, document.title, window.location.pathname);
}

// Convierte un número en un valor monetario con formato colombiano.
const formatoCOP = (n) => "$ " + Number(n || 0).toLocaleString("es-CO");

// Filtra tutores o tutorías según el texto y las opciones seleccionadas.
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

      const coincideTexto =
        !texto ||
        nombreTutor.toLowerCase().includes(texto) ||
        materiaTutoria.toLowerCase().includes(texto);

      const coincideMateria =
        !filtros.materia.value ||
        materiaTutoria.trim().toLowerCase() === filtros.materia.value.trim().toLowerCase();

      const coincideNivel =
        !filtros.nivel.value || nivelTutoria === filtros.nivel.value;

      const coincidePrecio =
        !filtros.precio.value || precioTutoria <= Number(filtros.precio.value);

      const coincideModalidad =
        !filtros.modalidad.value || modalidadTutoria === filtros.modalidad.value;

      return coincideTexto && coincideMateria && coincideNivel &&
        coincidePrecio && coincideModalidad;
    });
  }

  return tutores.filter((t) => {
    const coincideTexto =
      !texto ||
      t.nombre.toLowerCase().includes(texto) ||
      t.materia.toLowerCase().includes(texto);

    const coincideMateria =
      !filtros.materia.value || t.materia === filtros.materia.value;

    const coincideNivel =
      !filtros.nivel.value || t.nivel === filtros.nivel.value;

    const coincidePrecio =
      !filtros.precio.value || t.precio <= Number(filtros.precio.value);

    const coincideModalidad =
      !filtros.modalidad.value || t.modalidad === filtros.modalidad.value;

    return coincideTexto && coincideMateria && coincideNivel &&
      coincidePrecio && coincideModalidad;
  });
}

// Construye la tarjeta cuando la búsqueda se realiza por tutorías.
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
          <p class="tutor-card__precio">${formatoCOP(t.precio)}</p>
        </div>

        <div class="tutor-card__accion">
          <span class="tutor-card__disponible">
            ${Number(t.cupos) > 0 ? "Disponible" : "Sin cupos"}
          </span>

          <button
            type="button"
            class="tutor-card__boton"
            data-reservar="${t.id}"
            ${Number(t.cupos) <= 0 ? "disabled" : ""}
          >
            Reservar
          </button>
        </div>
      </div>
    </article>
  `;
}

// Construye el botón que permite consultar los horarios de un tutor.
function crearCupos(t) {
  const sesiones = Cupos.porTutor(t.nombre);

  if (!sesiones.length) {
    return `<p class="cupos-vacio">Sin tutorías programadas</p>`;
  }

  return `
    <div class="tutor-card__horarios">
      <button
        type="button"
        class="tutor-card__btn-horarios"
        data-ver-horarios="${encodeURIComponent(t.nombre)}"
      >
        <i class="bi bi-calendar-week"></i>
        Horarios disponibles
        <i class="bi bi-chevron-down"></i>
      </button>
    </div>
  `;
}

// Consulta nuevamente los cupos y actualiza los horarios mostrados en el modal.
function actualizarHorariosModal(nombreTutor) {
  const sesiones = Cupos.porTutor(nombreTutor);
  const contenedor = document.getElementById("listaHorariosModal");

  if (!contenedor) return;

  if (sesiones.length === 0) {
    contenedor.innerHTML = `
      <p class="cupos-vacio">No hay horarios disponibles.</p>
    `;
    return;
  }

  contenedor.innerHTML = sesiones.map((s) => {
    const agotado = Number(s.cupos) <= 0;

    return `
      <div class="horario-modal-item ${agotado ? "agotado" : ""}">
        <div class="horario-modal-item__info">
          <span class="horario-modal-item__dia">
            <i class="bi bi-calendar3"></i>
            ${s.fecha}
          </span>

          <strong>
            <i class="bi bi-clock"></i>
            ${s.hora}
          </strong>

          <span class="horario-modal-item__cupos">
            ${agotado ? "Sin cupos" : `${s.cupos} cupos disponibles`}
          </span>
        </div>

        <button
          type="button"
          class="horario-modal-item__reservar"
          data-reservar="${s.id}"
          ${agotado ? "disabled" : ""}
        >
          ${agotado ? "Agotado" : "Reservar"}
        </button>
      </div>
    `;
  }).join("");
}

// Construye la tarjeta visual de cada tutor.
function crearCard(t) {
  return `
    <article
      class="tutor-card"
      data-id="${t.id}"
      data-nombre="${t.nombre.toLowerCase().trim()}"
    >
      <img
        class="tutor-card__foto"
        src="${t.foto}"
        alt="Foto de ${t.nombre}"
      >

      <p class="tutor-card__rating">
        <span class="tutor-card__estrella">★</span>
        (${t.resenas} reseñas)
      </p>

      <h3 class="tutor-card__nombre">${t.nombre}</h3>

      <div class="tutor-card__fila">
        <div>
          <p class="tutor-card__materia">${t.materia}</p>
          <p class="tutor-card__desde">Desde</p>
          <p class="tutor-card__precio">${formatoCOP(t.precio)}</p>
        </div>

        <div class="tutor-card__accion">
          <span class="tutor-card__disponible">Disponible hoy</span>

          <a
            class="tutor-card__boton"
            href="../perfil-tutor/index.html?tutor=${t.id}"
          >
            Ver perfil
          </a>
        </div>
      </div>

      ${crearCupos(t)}
    </article>
  `;
}

// Genera los botones para cambiar entre las páginas de resultados.
function crearPaginacion(totalPaginas) {
  paginacion.innerHTML = "";

  if (totalPaginas <= 1) return;

  const boton = (
    texto,
    pagina,
    { activo = false, deshabilitado = false } = {}
  ) => {
    const b = document.createElement("button");

    b.textContent = texto;

    if (activo) b.classList.add("activo");

    b.disabled = deshabilitado;

    b.addEventListener("click", () => {
      idTutoriaSeleccionada = null;
      tutorIdSeleccionado = null;
      nombreTutorSeleccionado = null;

      paginaActual = pagina;
      render();
    });

    return b;
  };

  paginacion.appendChild(
    boton("‹", paginaActual - 1, {
      deshabilitado: paginaActual === 1
    })
  );

  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.appendChild(
      boton(i, i, { activo: i === paginaActual })
    );
  }

  paginacion.appendChild(
    boton("›", paginaActual + 1, {
      deshabilitado: paginaActual === totalPaginas
    })
  );
}

// Abre el modal que informa que no quedan cupos disponibles.
function mostrarModalSinCupos() {
  bootstrap.Modal
    .getOrCreateInstance(document.getElementById("modalSinCupos"))
    .show();
}

// Valida la sesión, registra la reserva y actualiza los horarios disponibles.
function procesarReserva(boton) {
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

  const idTutoria = Number(boton.dataset.reservar);

  const resultado = Reservas.reservar(
    idTutoria,
    sesion.correo
  );

  if (resultado === "agotado") {
    mostrarModalSinCupos();
    return;
  }

  if (resultado === "duplicada") {
    alert("Ya reservaste esta tutoría.");
    return;
  }

  if (resultado === "ok") {
    const modalTutor = document.getElementById("modalHorariosTutor");

    if (modalTutor && modalTutor.textContent.trim()) {
      actualizarHorariosModal(modalTutor.textContent.trim());
    }

    alert("¡Tutoría reservada! La verás en tu panel.");
  }
}

// Escucha los clics en el botón de horarios y abre el modal correspondiente.
lista.addEventListener("click", (e) => {
  const botonHorarios = e.target.closest("[data-ver-horarios]");

  if (!botonHorarios) return;

  const nombreTutor = decodeURIComponent(
    botonHorarios.dataset.verHorarios
  );

  document.getElementById("modalHorariosTutor").textContent = nombreTutor;

  actualizarHorariosModal(nombreTutor);

  bootstrap.Modal
    .getOrCreateInstance(modalHorarios)
    .show();
});

// Detecta los clics en los botones Reservar de las tarjetas.
lista.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-reservar]");

  if (!boton) return;

  procesarReserva(boton);
});

// Detecta los clics en los botones Reservar que están dentro del modal.
if (modalHorarios) {
  modalHorarios.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-reservar]");

    if (!boton) return;

    procesarReserva(boton);
  });
}

// Consulta los resultados, crea las tarjetas y actualiza la paginación.
function render() {
  const tipoFiltro = filtros.busqueda ? filtros.busqueda.value : "tutor";
  const resultado = filtrarElementos();

  const totalPaginas = Math.ceil(resultado.length / POR_PAGINA);

  if (paginaActual > totalPaginas) {
    paginaActual = 1;
  }

  if (idTutoriaSeleccionada && tipoFiltro === "tutoria" && paginaActual === 1) {
    const tutoriasGuardadas = JSON.parse(localStorage.getItem("tutorias")) || [];

    const index = tutoriasGuardadas.findIndex(
      (t) => String(t.id) === String(idTutoriaSeleccionada)
    );

    if (index !== -1) {
      paginaActual = Math.floor(index / POR_PAGINA) + 1;
    }
  } else if (
    (tutorIdSeleccionado || nombreTutorSeleccionado) &&
    tipoFiltro !== "tutoria" &&
    paginaActual === 1
  ) {
    const index = tutores.findIndex((t) =>
      (tutorIdSeleccionado && String(t.id) === String(tutorIdSeleccionado)) ||
      (nombreTutorSeleccionado &&
        t.nombre.toLowerCase().trim() === nombreTutorSeleccionado.toLowerCase().trim())
    );

    if (index !== -1) {
      paginaActual = Math.floor(index / POR_PAGINA) + 1;
    }
  }

  const inicioCalculado = (paginaActual - 1) * POR_PAGINA;

  const pagina = resultado.slice(
    inicioCalculado,
    inicioCalculado + POR_PAGINA
  );

  if (pagina.length === 0) {
    lista.innerHTML = `
      <p class="tutores__vacio">
        No encontramos resultados con esos filtros. Prueba quitando alguno.
      </p>
    `;

    paginacion.innerHTML = "";
    return;
  }

  if (tipoFiltro === "tutoria") {
    lista.innerHTML = pagina.map(crearCardTutoria).join("");
  } else {
    lista.innerHTML = pagina.map(crearCard).join("");
  }

  crearPaginacion(totalPaginas);

  if (idTutoriaSeleccionada) {
    const tarjeta = lista.querySelector(
      `[data-id="${idTutoriaSeleccionada}"]`
    );

    if (tarjeta) {
      tarjeta.classList.add("tutor-card--seleccionado");
      tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } else if (tutorIdSeleccionado) {
    const tarjeta = lista.querySelector(
      `[data-id="${tutorIdSeleccionado}"]`
    );

    if (tarjeta) {
      tarjeta.classList.add("tutor-card--seleccionado");
      tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } else if (nombreTutorSeleccionado) {
    const tarjetas = lista.querySelectorAll(".tutor-card");

    tarjetas.forEach((tarjeta) => {
      const nombreEl = tarjeta.querySelector(".tutor-card__nombre");

      if (
        nombreEl &&
        nombreEl.textContent.toLowerCase().trim() ===
        nombreTutorSeleccionado.toLowerCase().trim()
      ) {
        tarjeta.classList.add("tutor-card--seleccionado");
        tarjeta.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }
}

// Ejecuta la búsqueda cuando se envía el formulario.
document.getElementById("formBuscador").addEventListener("submit", (e) => {
  e.preventDefault();

  idTutoriaSeleccionada = null;
  tutorIdSeleccionado = null;
  nombreTutorSeleccionado = null;

  paginaActual = 1;
  render();
});

// Actualiza los resultados cuando cambia cualquiera de los filtros.
Object.values(filtros).forEach((select) => {
  select.addEventListener("change", () => {
    idTutoriaSeleccionada = null;
    tutorIdSeleccionado = null;
    nombreTutorSeleccionado = null;

    paginaActual = 1;
    render();
  });
});

// Restablece los campos de búsqueda y muestra nuevamente todos los resultados.
document.getElementById("btnLimpiar").addEventListener("click", () => {
  Object.values(filtros).forEach((select) => {
    select.value = "";
  });

  inputBuscar.value = "";

  idTutoriaSeleccionada = null;
  tutorIdSeleccionado = null;
  nombreTutorSeleccionado = null;

  paginaActual = 1;
  render();
});

// Vuelve a dibujar las tarjetas cuando se notifica un cambio en los cupos.
window.addEventListener("cupos:cambio", () => {
  render();
});

// Carga las tarjetas cuando se abre la página.
render();

// Actualiza la información cuando otra pestaña modifica el almacenamiento local.
window.addEventListener("storage", (evento) => {
  if (evento.key === "skillup_tutores" || evento.key === "tutorias") {
    if (typeof sincronizarTutoresDesdeStorage === "function") {
      sincronizarTutoresDesdeStorage();
    }

    paginaActual = 1;
    render();
  }
});

// Actualiza las tarjetas cuando el administrador modifica las tutorías.
window.addEventListener("tutorias:cambio", () => {
  if (typeof sincronizarTutoresDesdeStorage === "function") {
    sincronizarTutoresDesdeStorage();
  }

  paginaActual = 1;
  render();
});
