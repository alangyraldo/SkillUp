// Carrito de reservas de SkillUp: botón flotante + panel lateral derecho.
// Va DESPUÉS de cupos.js y ANTES de buscar-tutor.js.

(() => {
  const CLAVE = "carrito";            // dónde se guarda el carrito en localStorage
  const CLAVE_ANCHO = "carritoAncho"; // dónde se guarda el ancho del panel
  const ANCHO_MIN = 320;

  // CAMBIA estos dos valores por los reales de tu proyecto:
  const RUTA_LOGIN = "../iniciar-sesion/index.html"; // ruta de tu página de inicio de sesión
  const CLAVE_SESION = "usuarioActivo";              // clave de localStorage donde guardas al usuario logueado

  const formatoCOP = (n) => "$ " + n.toLocaleString("es-CO");
  const anchoBase = () => Math.max(340, window.innerWidth * 0.25); // ≈ un cuarto de pantalla

  // ---------- 1. Estado ----------
  let carrito = JSON.parse(localStorage.getItem(CLAVE)) || [];
  let ancho = Number(localStorage.getItem(CLAVE_ANCHO)) || anchoBase();

  function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(carrito));
  }

  const calcularTotal = () => carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);
  const contarCupos = () => carrito.reduce((suma, i) => suma + i.cantidad, 0);

  // ---------- 2. HTML (lo crea este archivo, no hay que copiarlo) ----------
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "carrito-flotante";
  boton.setAttribute("aria-label", "Abrir carrito de reservas");
  boton.innerHTML = `<i class="bi-book"></i><span class="carrito-flotante__contador"></span>`;

  const panel = document.createElement("aside");
  panel.className = "carrito-panel";
  panel.innerHTML = `
    <div class="carrito-panel__manija" title="Arrastra para cambiar el ancho"></div>
    <header class="carrito-panel__encabezado">
      <h2>Mis reservas</h2>
      <button type="button" id="carritoAmpliar" aria-label="Ampliar o reducir"><i class="bi bi-arrows-angle-expand"></i></button>
      <button type="button" id="carritoCerrar" aria-label="Cerrar"><i class="bi bi-x-lg"></i></button>
    </header>
    <div class="carrito-panel__items" id="carritoItems"></div>
    <footer class="carrito-panel__pie">
      <p class="carrito-panel__mensaje" id="carritoMensaje"></p>
      <div class="carrito-panel__total carrito-panel__total--cantidad">
      <span>Tutorías reservadas</span><strong id="carritoCantidad"></strong>
      </div>
      <div class="carrito-panel__total"><span>Total</span><strong id="carritoTotal"></strong></div>
      <button type="button" class="carrito-panel__confirmar" id="carritoConfirmar">Confirmar reservas</button>
    </footer>`;

  document.body.append(boton, panel);

  const contenedor = document.getElementById("carritoItems");
  const mensaje = document.getElementById("carritoMensaje");
  const manija = panel.querySelector(".carrito-panel__manija");
  const contador = boton.querySelector(".carrito-flotante__contador");

  // ---------- 3. Pintar el carrito ----------
  function crearItem(i) {
    return `
      <article class="carrito-item">
        <img class="carrito-item__foto" src="${i.foto}" alt="Foto">
        <div class="carrito-item__info">
          <!-- TÍTULO DE LA TUTORÍA (O nombre del tutor si es normal) -->
          <h3 class="carrito-item__nombre">${i.tituloTutoria ? i.tituloTutoria : i.nombreTutor}</h3>
          
          <!-- NOMBRE DEL TUTOR (Visible debajo si es una tutoría) -->
          ${i.tituloTutoria ? `<p class="carrito-item__subtutor" style="font-size: 0.85rem; color: #555; font-weight: 600; margin: 3px 0;">Tutor: ${i.nombreTutor}</p>` : ''}
          
          <p class="carrito-item__materia">${i.materia}</p>
          <p class="carrito-item__horario">${i.fecha} ${i.hora}</p>
          

            <strong>${formatoCOP(i.precio * i.cantidad)}</strong>
          </div>
        </div>
        <button type="button" class="carrito-item__eliminar" data-eliminar="${i.id}" aria-label="Eliminar reserva">
          <i class="bi bi-trash3"></i>
        </button>
      </article>`;
  }

  function render() {
    contenedor.innerHTML = carrito.length
      ? carrito.map(crearItem).join("")
      : `<p class="carrito-panel__vacio">Aún no tienes reservas. Pulsa "Reservar" en una tutoría para agregarla.</p>`;

    document.getElementById("carritoTotal").textContent = formatoCOP(calcularTotal());
    document.getElementById("carritoCantidad").textContent = carrito.length;
    document.getElementById("carritoConfirmar").disabled = carrito.length === 0;
    contador.textContent = contarCupos();
    contador.hidden = carrito.length === 0;
    mensaje.textContent = "";
  }

  function actualizar() {
    guardar();
    render();
  }

  // ---------- 4. Acciones ----------
function agregar(item) {
  const existente = carrito.find((i) => i.id === item.id);
  if (existente) {
    mostrarAviso("Ya tienes esta tutoría en tu carrito.", "error", 3000);
    return true; // no es un error de cupos, así que no sale el modal
  }
  carrito.push({ ...item, cantidad: 1 });
  actualizar();
  return true;
}

  function cambiarCantidad(id, delta) {
    const item = carrito.find((i) => i.id === id);
    const nueva = item.cantidad + delta;
    if (nueva < 1 || nueva > item.cupos) return;
    item.cantidad = nueva;
    actualizar();
  }

  function eliminar(id) {
    carrito = carrito.filter((i) => i.id !== id);
    actualizar();
  }

  /*
  function confirmar() {
    carrito = carrito.filter((item) => {
      while (item.cantidad > 0 && typeof Cupos !== "undefined" && Cupos.descontar(item.id)) item.cantidad--;
      return item.cantidad > 0;
    });
    actualizar();
    mensaje.textContent = carrito.length
      ? "Algunas tutorías ya no tienen cupos suficientes. Revisa tu carrito."
      : "¡Reservas confirmadas!";
  }

  const haySesion = () => localStorage.getItem(CLAVE_SESION) !== null;
*/
  function confirmar() {
    const sesion = obtenerSesion();

    if (!sesion || sesion.rol === "admin") {
      mostrarAviso("Inicia sesión con una cuenta de estudiante para confirmar tus reservas.", "error", 3000);
      return;
    }

    if (typeof Reservas === "undefined") {
      mostrarAviso("No fue posible registrar las reservas. Intenta nuevamente.", "error", 3000);
      return;
    }

    const reservasConfirmadas = [];
    const reservasFallidas = [];

    carrito.forEach((item) => {
     /* const resultado = Reservas.reservar(item.id, sesion.correo);*/
      const resultado = Reservas.reservar( item.id, sesion.correo, item.cantidad);
      if (resultado === "ok") {
        reservasConfirmadas.push(item);
      } else {
        reservasFallidas.push(item);
      }
    });

    // Quitamos del carrito únicamente las reservas que se registraron.
    const idsConfirmados = new Set(reservasConfirmadas.map((item) => item.id));
    carrito = carrito.filter((item) => !idsConfirmados.has(item.id));
    actualizar();

    if (reservasConfirmadas.length > 0) {
      mostrarAviso("Tus tutorías se han asignado correctamente", "exito", 3000);
      setTimeout(() => {
      window.location.href = "../dashboard-usuario/index.html";}, 1500);
      return;
    }

    if (reservasFallidas.length > 0) {
      mostrarAviso("No fue posible confirmar las reservas. Verifica los cupos disponibles o si ya reservaste esas tutorías.", "error", 3000);
    }
  }

  const haySesion = () => obtenerSesion() !== null;
  function irAConfirmar() {
    if (!haySesion()) {
      window.location.href = RUTA_LOGIN;
      return;
    }
    confirmar();
  }

  // ---------- 5. Abrir / cerrar y ancho ----------
  function abrirCerrar(abrir) {
    panel.classList.toggle("abierto", abrir);
    boton.classList.toggle("abierto", abrir);
  }

  function fijarAncho(px) {
    ancho = Math.min(Math.max(px, ANCHO_MIN), window.innerWidth * 0.9);
    document.documentElement.style.setProperty("--carrito-ancho", ancho + "px");
    localStorage.setItem(CLAVE_ANCHO, ancho);
  }

  boton.addEventListener("click", () => abrirCerrar(!panel.classList.contains("abierto")));
  document.getElementById("carritoCerrar").addEventListener("click", () => abrirCerrar(false));
  document.getElementById("carritoConfirmar").addEventListener("click", irAConfirmar);

  document.getElementById("carritoAmpliar").addEventListener("click", () => {
    fijarAncho(ancho > anchoBase() + 40 ? anchoBase() : window.innerWidth * 0.5);
  });

  manija.addEventListener("pointerdown", (e) => {
    manija.setPointerCapture(e.pointerId);
    panel.classList.add("arrastrando");
  });
  manija.addEventListener("pointermove", (e) => {
    if (manija.hasPointerCapture(e.pointerId)) fijarAncho(window.innerWidth - e.clientX);
  });
  manija.addEventListener("pointerup", () => panel.classList.remove("arrastrando"));

  contenedor.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.eliminar) eliminar(Number(b.dataset.eliminar));
  });

  // ---------- 6. Botones "Reservar" del catálogo ----------
  function buscarSesion(id) {
    if (typeof tutores !== "undefined") {
      for (const tutor of tutores) {
        const sesion = typeof Cupos !== "undefined" ? Cupos.porTutor(tutor.nombre).find((s) => Number(s.id) === Number(id)) : null;
        if (sesion) return { tutor, sesion };
      }
    }
    return null;
  }

  function avisarSinCupos() {
    const modal = document.getElementById("modalSinCupos");
    if (modal) bootstrap.Modal.getOrCreateInstance(modal).show();
  }

  document.addEventListener("click", (e) => {
    const botonReservar = e.target.closest("[data-reservar]");
    if (!botonReservar) return;

    const id = Number(botonReservar.dataset.reservar);

    // 1. Buscamos primero si es una tutoría guardada en localStorage
    const tutoriasGuardadas = JSON.parse(localStorage.getItem("tutorias")) || [];
    const tutoria = tutoriasGuardadas.find((t) => Number(t.id) === id);

    let itemParaAgregar = null;

    if (tutoria) {
      itemParaAgregar = {
        id,
        tituloTutoria: tutoria.titulo || "Tutoría",
        nombreTutor: tutoria.tutor || "Sin tutor",
        materia: tutoria.materia,
        foto: tutoria.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutoria.tutor || "Tutor")}&background=random`,
        fecha: tutoria.fecha || "Próximamente",
        hora: tutoria.hora || "",
        precio: Number(tutoria.precio || 0),
        cupos: Number(tutoria.cupos || 10)
      };
    } else {
      // 2. Si no es tutoría, busca en el listado normal de tutores
      const encontrado = buscarSesion(id);
      if (!encontrado) return;
      const { tutor, sesion } = encontrado;
      itemParaAgregar = {
        id,
        tituloTutoria: null,
        nombreTutor: tutor.nombre,
        materia: tutor.materia,
        foto: tutor.foto,
        fecha: sesion.fecha,
        hora: sesion.hora,
        precio: tutor.precio,
        cupos: sesion.cupos
      };
    }

    e.stopPropagation();

    const agregado = itemParaAgregar.cupos > 0 && agregar(itemParaAgregar);
    if (!agregado) avisarSinCupos();
  }, true);

  // ---------- 7. Arranque ----------
  fijarAncho(ancho);
  render();
})();