// Alertas con estilo para SkillUp (usa SweetAlert2)
function elegirIcono(mensaje) {
  const m = String(mensaje).toLowerCase();
  if (/exitos|reservada|guardad|agreg|cread|eliminad/.test(m)) return 'success';
  if (/inicia sesión|entra con|ya reservaste|debe haber|selecciona/.test(m)) return 'warning';
  return 'error';
}

function alertaExito(mensaje) {
  return Swal.fire({ icon: 'success', title: mensaje, timer: 2000, showConfirmButton: false });
}

function alertaError(mensaje) {
  return Swal.fire({ icon: 'error', title: 'Ups...', text: mensaje });
}

function alertaAviso(mensaje) {
  return Swal.fire({ icon: 'warning', title: mensaje });
}

function alertaConfirmar(mensaje) {
  return Swal.fire({
    title: mensaje, icon: 'question',
    showCancelButton: true, confirmButtonText: 'Sí', cancelButtonText: 'Cancelar'
  });
}

// Reemplaza el alert() del navegador por uno con estilo
window.alert = function (mensaje) {
  const icono = elegirIcono(mensaje);
  Swal.fire({
    icon: icono,
    title: String(mensaje),
    timer: icono === 'success' ? 2000 : undefined,
    showConfirmButton: icono !== 'success'
  });
};