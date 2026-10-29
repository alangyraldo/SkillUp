const sesion = obtenerSesion();

if (!sesion) {
  window.location.replace('/pages/iniciar-sesion/index.html');
} else if (sesion.rol === 'admin') {
  window.location.replace('/pages/dashboard-admin/index.html');
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
      : `<p class="reservas-vacio">Aún no has reservado tutorías. <a href="/pages/buscar-tutor/index.html">Busca un tutor</a></p>`;
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
    window.location.href = '/pages/iniciar-sesion/index.html';
  });

  pintar();
  lucide.createIcons();
}