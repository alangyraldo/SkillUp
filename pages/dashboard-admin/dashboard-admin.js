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

// Actualiza los contadores del administrador.
function actualizarMetricasTutores() {
  const tutores = JSON.parse(localStorage.getItem("skillup_tutores") || "[]");
  const tutorias = JSON.parse(localStorage.getItem("tutorias") || "[]");

  const totalTutores = document.getElementById("total-tutores-admin");
  const totalTutorias = document.getElementById("total-tutorias-admin");

  if (totalTutores) totalTutores.textContent = tutores.length;
  if (totalTutorias) totalTutorias.textContent = tutorias.length;
}

// Actualiza las métricas al cargar el dashboard.
document.addEventListener("DOMContentLoaded", actualizarMetricasTutores);

// Actualiza las métricas cuando se registra una tutoría.
window.addEventListener("tutorias:cambio", actualizarMetricasTutores);


