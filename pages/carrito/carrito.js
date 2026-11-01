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
      <div class="carrito-panel__total"><span>Total</span><strong id="carritoTotal"></strong></div>
      <button type="button" class="carrito-panel__confirmar" id="carritoConfirmar">Confirmar reservas</button>
    </footer>`;
 
  document.body.append(boton, panel);
 
  const contenedor = document.getElementById("carritoItems");
  const mensaje = document.getElementById("carritoMensaje");
  const manija = panel.querySelector(".carrito-panel__manija");
  const contador = boton.querySelector(".carrito-flotante__contador");
 
  // ---------- 3. Pintar el carrito ----------
  // Misma estructura que la card del catálogo, en versión compacta
  function crearItem(i) {
    return `
      <article class="carrito-item">
        <img class="carrito-item__foto" src="${i.foto}" alt="Foto de ${i.tutor}">
        <div class="carrito-item__info">
          <h3 class="carrito-item__nombre">${i.tutor}</h3>
          <p class="carrito-item__materia">${i.materia}</p>
          <p class="carrito-item__horario">${i.fecha} ${i.hora}</p>
          <div class="carrito-item__fila">
            <div class="carrito-item__cantidad">
              <button type="button" data-menos="${i.id}" aria-label="Quitar un cupo">−</button>
              <span>${i.cantidad}</span>
              <button type="button" data-mas="${i.id}" aria-label="Agregar un cupo">+</button>
            </div>
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
  // item = { id, tutor, materia, foto, fecha, hora, precio, cupos }
  // Devuelve false si ya no se pueden agregar más cupos.
  function agregar(item) {
    const existente = carrito.find((i) => i.id === item.id);
    if (existente) {
      existente.cupos = item.cupos;
      if (existente.cantidad >= item.cupos) return false;
      existente.cantidad++;
    } else {
      carrito.push({ ...item, cantidad: 1 });
    }
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
 
  // Aquí es donde realmente se descuentan los cupos.
  function confirmar() {
    carrito = carrito.filter((item) => {
      while (item.cantidad > 0 && Cupos.descontar(item.id)) item.cantidad--;
      return item.cantidad > 0; // los que ya no tenían cupos se quedan en el carrito
    });
    actualizar();
    mensaje.textContent = carrito.length
      ? "Algunas tutorías ya no tienen cupos suficientes. Revisa tu carrito."
      : "¡Reservas confirmadas!";
  }
 
  // Al pulsar "Confirmar reservas": si no hay sesión iniciada, va a iniciar sesión.
  // El carrito queda guardado en localStorage, así que no se pierde.
  const haySesion = () => localStorage.getItem(CLAVE_SESION) !== null;
 
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
 
  // Botón ampliar/reducir: alterna entre un cuarto y la mitad de la pantalla
  document.getElementById("carritoAmpliar").addEventListener("click", () => {
    fijarAncho(ancho > anchoBase() + 40 ? anchoBase() : window.innerWidth * 0.5);
  });
 
  // Arrastrar la manija del borde izquierdo para cambiar el ancho
  manija.addEventListener("pointerdown", (e) => {
    manija.setPointerCapture(e.pointerId);
    panel.classList.add("arrastrando");
  });
  manija.addEventListener("pointermove", (e) => {
    if (manija.hasPointerCapture(e.pointerId)) fijarAncho(window.innerWidth - e.clientX);
  });
  manija.addEventListener("pointerup", () => panel.classList.remove("arrastrando"));
 
  // Botones + / − / eliminar dentro del carrito
  contenedor.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.mas) cambiarCantidad(Number(b.dataset.mas), 1);
    if (b.dataset.menos) cambiarCantidad(Number(b.dataset.menos), -1);
    if (b.dataset.eliminar) eliminar(Number(b.dataset.eliminar));
  });
 
  // ---------- 6. Botones "Reservar" del catálogo ----------
  // buscar-tutor.js no se modifica. Este archivo escucha el clic ANTES que él
  // (el "true" del final = fase de captura) y corta ahí el evento, para que
  // no descuente el cupo en ese momento: los cupos se descuentan al confirmar.
 
  // Busca la sesión por su id y devuelve también a su tutor
  function buscarSesion(id) {
    for (const tutor of tutores) {
      const sesion = Cupos.porTutor(tutor.nombre).find((s) => s.id === id);
      if (sesion) return { tutor, sesion };
    }
  }
 
  function avisarSinCupos() {
    const modal = document.getElementById("modalSinCupos"); // el modal que ya tienes en el HTML
    if (modal) bootstrap.Modal.getOrCreateInstance(modal).show();
  }
 
  document.addEventListener("click", (e) => {
    const botonReservar = e.target.closest("[data-reservar]");
    if (!botonReservar) return;
 
    const id = Number(botonReservar.dataset.reservar);
    const encontrado = buscarSesion(id);
    if (!encontrado) return; // si no la encuentra, deja que actúe el código original
 
    e.stopPropagation(); // evita que buscar-tutor.js descuente el cupo ahora
 
    const { tutor, sesion } = encontrado;
    const agregado = sesion.cupos > 0 && agregar({
      id,
      tutor: tutor.nombre,
      materia: tutor.materia,
      foto: tutor.foto,
      fecha: sesion.fecha,
      hora: sesion.hora,
      precio: tutor.precio,
      cupos: sesion.cupos
    });
 
    if (!agregado) avisarSinCupos();
  }, true);
 
  // ---------- 7. Arranque ----------
  fijarAncho(ancho);
  render();
})();