const sesion = obtenerSesion();

if (!sesion) {
  window.location.replace('../../pages/iniciar-sesion/index.html');
} else if (sesion.rol === 'admin') {
  window.location.replace('../../pages/dashboard-admin/index.html');
} else {
  iniciarPanel();
}

function iniciarPanel() {
  const contenedor = document.getElementById('listaReservas');
  const formatoCOP = (n) => '$' + Number(n).toLocaleString('es-CO');
  const escapar = (texto) => String(texto ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const nombre = sesion.nombre || sesion.correo;
  document.getElementById('usuario-nombre').textContent = nombre;
  document.getElementById('usuario-avatar').textContent = nombre.charAt(0).toUpperCase();

  function filaReserva(r) {
    return `
      <div class="fila-tabla cuerpo-tabla">
        <div class="columna texto-resaltado">${escapar(r.titulo)}</div>
        <div class="columna">${escapar(r.tutor)}</div>
        <div class="columna">${escapar(r.fecha)} ${escapar(r.hora)}</div>
        <div class="columna">${formatoCOP(r.precio)}</div>
        <div class="columna"><span class="etiqueta-estado estado-activo">Reservada</span></div>
        <div class="columna">
          <button type="button" class="btn-cancelar-reserva" data-cancelar="${r.id}">Cancelar</button>
        </div>
      </div>`;
  }

  function pintar() {
    const reservas = Reservas.porUsuario(sesion.correo);

    document.getElementById('total-reservas').textContent = reservas.length;
    document.getElementById('total-tutores').textContent = new Set(reservas.map((r) => r.tutor)).size;
    document.getElementById('total-pagar').textContent =
      formatoCOP(reservas.reduce((suma, r) => suma + r.precio, 0));

    contenedor.innerHTML = reservas.length
      ? reservas.map(filaReserva).join('')
      : `<p class="reservas-vacio">Aún no has reservado tutorías. <a href="../../pages/buscar-tutor/index.html">Busca un tutor</a></p>`;
  }

  contenedor.addEventListener('click', (e) => {
    const boton = e.target.closest('[data-cancelar]');
    if (!boton) return;
    if (confirm('¿Cancelar esta reserva? El cupo quedará libre de nuevo.')) {
      Reservas.cancelar(Number(boton.dataset.cancelar));
      pintar();
    }
  });

  document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
    cerrarSesion();
    window.location.href = '../../pages/iniciar-sesion/index.html';
  });

  pintar();
  lucide.createIcons();
}

// Boton de configuraciones

(function () {
  if (!obtenerSesion()) return;

  const campos = [
    ['nombre', 'Nombre', 'text'],
    ['apellido', 'Apellido', 'text'],
    ['telefono', 'Número de teléfono', 'tel'],
    ['correo', 'Correo electrónico', 'email'],
    ['claveActual', 'Contraseña actual (solo si cambias la contraseña)', 'password'],
    ['claveNueva', 'Nueva contraseña', 'password'],
    ['claveConfirmar', 'Confirmar nueva contraseña', 'password'],
  ];

  document.body.insertAdjacentHTML('beforeend', `
    <div class="cfg-overlay" id="cfg-overlay">
      <form class="cfg-modal" id="cfg-form" novalidate>
        <div class="cfg-encabezado">
          <h2>Configuraciones</h2>
          <button type="button" class="cfg-cerrar" id="cfg-cerrar" aria-label="Cerrar">&times;</button>
        </div>
        ${campos.map(([n, t, tipo]) => `<label>${t}<input name="${n}" type="${tipo}"></label>`).join('')}
        <p class="cfg-msg" id="cfg-msg"></p>
        <button type="submit" class="cfg-btn">Guardar cambios</button>
      </form>
    </div>`);

  const overlay = document.getElementById('cfg-overlay');
  const form = document.getElementById('cfg-form');
  const msg = document.getElementById('cfg-msg');
  const f = form.elements;

  const enlaceCfg = document.getElementById('btn-configuraciones');
  const enlaceActivo = document.querySelector('.enlace-menu.activo');

  const abrir = () => {
    const u = leerUsuarios().find((x) => x.correo === obtenerSesion().correo) || {};
    form.reset();
    ['nombre', 'apellido', 'telefono', 'correo'].forEach((k) => (f[k].value = u[k] || ''));
    msg.textContent = '';
    enlaceActivo.classList.remove('activo');
    enlaceCfg.classList.add('activo');
    overlay.classList.add('abierto');
  };
  const cerrar = () => {
    enlaceCfg.classList.remove('activo');
    enlaceActivo.classList.add('activo');
    overlay.classList.remove('abierto');
  };

  document.getElementById('btn-configuraciones').addEventListener('click', (e) => { e.preventDefault(); abrir(); });
  document.getElementById('cfg-cerrar').addEventListener('click', cerrar);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ses = obtenerSesion();
    const usuarios = leerUsuarios();
    const u = usuarios.find((x) => x.correo === ses.correo);
    const nombre = f.nombre.value.trim();
    const correo = f.correo.value.trim().toLowerCase();
    const telefono = f.telefono.value.replace(/\D/g, '');
    const nueva = f.claveNueva.value;

    const error =
      !u ? 'No se encontró tu usuario.' :
      !nombre ? 'El nombre es obligatorio.' :
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ? 'Ingresa un correo válido.' :
      correo === ADMIN.correo || (correo !== u.correo && usuarios.some((x) => x.correo === correo)) ? 'Ese correo no está disponible.' :
      telefono && telefono.length < 7 ? 'Ingresa un teléfono válido.' :
      nueva && f.claveActual.value !== u.clave ? 'La contraseña actual es incorrecta.' :
      nueva && nueva.length < 6 ? 'La nueva contraseña debe tener mínimo 6 caracteres.' :
      nueva !== f.claveConfirmar.value ? 'Las contraseñas no coinciden.' : '';

    msg.className = 'cfg-msg ' + (error ? 'error' : 'ok');
    if (error) { msg.textContent = error; return; }

    Object.assign(u, { nombre, apellido: f.apellido.value.trim(), telefono, correo });
    if (nueva) u.clave = nueva;
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ ...ses, correo, nombre }));

    document.getElementById('usuario-nombre').textContent = nombre;
    document.getElementById('usuario-avatar').textContent = nombre.charAt(0).toUpperCase();
    msg.textContent = 'Cambios guardados correctamente.';
    f.claveActual.value = f.claveNueva.value = f.claveConfirmar.value = '';
    if (correo !== ses.correo) setTimeout(() => location.reload(), 900);
  });
})();