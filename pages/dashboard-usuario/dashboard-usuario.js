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

 /* function filaReserva(r) {
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
  }*/
 function filaReserva(r) {
    return `
      <div class="fila-tabla cuerpo-tabla">
        <div class="columna texto-resaltado">${escapar(r.titulo)}</div>
        <div class="columna texto-resaltado">${escapar(r.titulo)} (x${Number(r.cantidad) || 1})</div>
        <div class="columna">${escapar(r.tutor)}</div>
        <div class="columna">${escapar(r.fecha)} ${escapar(r.hora)}</div>
        <div class="columna">${formatoCOP(r.precio)}</div>
        <div class="columna"><span class="etiqueta-estado estado-activo">Reservada</span></div>
        <div class="columna">
          <button type="button" class="btn-cancelar-reserva" data-cancelar="${r.id}">Cancelar</button>
        </div>
      </div>`;
  }

  /*
  function pintar() {
    const reservas = Reservas.porUsuario(sesion.correo);

    document.getElementById('total-reservas').textContent = reservas.length;
    document.getElementById('total-tutores').textContent = new Set(reservas.map((r) => r.tutor)).size;
    document.getElementById('total-pagar').textContent =
      formatoCOP(reservas.reduce((suma, r) => suma + r.precio, 0));

    contenedor.innerHTML = reservas.length
      ? reservas.map(filaReserva).join('')
      : `<p class="reservas-vacio">Aún no has reservado tutorías. <a href="../../pages/buscar-tutor/index.html">Busca un tutor</a></p>`;
  }*/

  function pintar() {
    const reservas = Reservas.porUsuario(sesion.correo);

    document.getElementById('total-reservas').textContent =
      reservas.reduce((suma, r) => suma + (Number(r.cantidad) || 1), 0);

    document.getElementById('total-pagar').textContent =
      formatoCOP(
        reservas.reduce(
          (suma, r) => suma + (Number(r.precio) * (Number(r.cantidad) || 1)), 0));

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

// CONEXION base de datos Boton de configuraciones 

(function () {
  const sesionInicial = obtenerSesion();
  if (!sesionInicial) return;

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
          <h2>Configuración</h2>
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
    const ses = obtenerSesion();
    form.reset();
    if (ses) {
      f.nombre.value = ses.nombre || '';
      f.apellido.value = ses.apellido || '';
      f.telefono.value = ses.telefono || '';
      f.correo.value = ses.correo || '';
    }
    msg.textContent = '';
    if (enlaceActivo) enlaceActivo.classList.remove('activo');
    if (enlaceCfg) enlaceCfg.classList.add('activo');
    overlay.classList.add('abierto');
  };

  const cerrar = () => {
    if (enlaceCfg) enlaceCfg.classList.remove('activo');
    if (enlaceActivo) enlaceActivo.classList.add('activo');
    overlay.classList.remove('abierto');
  };

  if (enlaceCfg) enlaceCfg.addEventListener('click', (e) => { e.preventDefault(); abrir(); });
  document.getElementById('cfg-cerrar').addEventListener('click', cerrar);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ses = obtenerSesion();
    const nombre = f.nombre.value.trim();
    const apellido = f.apellido.value.trim();
    const telefono = f.telefono.value.replace(/\D/g, '');
    const correo = f.correo.value.trim().toLowerCase();
    const claveActual = f.claveActual.value;
    const claveNueva = f.claveNueva.value;
    const claveConfirmar = f.claveConfirmar.value;

    const errorValidacion =
      !nombre ? 'El nombre es obligatorio.' :
      !apellido ? 'El apellido es obligatorio.' :
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ? 'Ingresa un correo válido.' :
      telefono && telefono.length < 7 ? 'Ingresa un teléfono válido.' :
      claveNueva && !claveActual ? 'Ingresa tu contraseña actual para cambiarla.' :
      claveNueva && claveNueva.length < 6 ? 'La nueva contraseña debe tener mínimo 6 caracteres.' :
      claveNueva !== claveConfirmar ? 'Las contraseñas nuevas no coinciden.' : '';

    if (errorValidacion) {
      msg.className = 'cfg-msg error';
      msg.textContent = errorValidacion;
      return;
    }

    try {
      const actualizado = await apiRequest(`/usuarios/${ses.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nombre,
          apellido,
          telefono,
          email: correo,
          contrasenaActual: claveActual || null,
          contrasenaNueva: claveNueva || null
        })
      });

      const cambioCorreo = actualizado.email.toLowerCase() !== ses.correo.toLowerCase();

      localStorage.setItem(CLAVE_SESION, JSON.stringify({
        ...ses,
        nombre: actualizado.nombre,
        apellido: actualizado.apellido,
        telefono: actualizado.telefono,
        correo: actualizado.email
      }));

      const spanAdmin = document.getElementById('admin-correo');
      if (spanAdmin) spanAdmin.textContent = actualizado.email;

      const spanUsuario = document.getElementById('usuario-nombre');
      if (spanUsuario) spanUsuario.textContent = actualizado.nombre;

      const avatarUsuario = document.getElementById('usuario-avatar');
      if (avatarUsuario) avatarUsuario.textContent = actualizado.nombre.charAt(0).toUpperCase();

      msg.className = 'cfg-msg ok';
      f.claveActual.value = f.claveNueva.value = f.claveConfirmar.value = '';

      if (cambioCorreo) {
        msg.textContent = 'Correo actualizado. Redirigiendo para iniciar sesión de nuevo...';
        setTimeout(() => {
          cerrarSesion();
          window.location.replace('../../pages/iniciar-sesion/index.html');
        }, 1500);
      } else {
        msg.textContent = 'Cambios guardados correctamente.';
      }
    } catch (error) {
      msg.className = 'cfg-msg error';
      msg.textContent = error.message || 'No se pudieron guardar los cambios.';
    }
  });
})();


/*
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

  */
