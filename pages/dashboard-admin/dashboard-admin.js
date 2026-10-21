// Protege la vista: si no es admin, vuelve al login
if (!esAdmin()) {
  window.location.replace('/pages/iniciar-sesion/index.html');
}

document.addEventListener('DOMContentLoaded', function () {
  const sesion = obtenerSesion();
  const spanCorreo = document.getElementById('admin-correo');
  if (sesion && spanCorreo) {
    spanCorreo.textContent = sesion.correo;
  }

  const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', function () {
      cerrarSesion();
      window.location.href = '/pages/iniciar-sesion/index.html';
    });
  }
});