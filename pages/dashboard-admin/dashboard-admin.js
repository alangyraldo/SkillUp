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
  const totalEstudiantes = document.getElementById("total-estudiantes-admin");

  if (totalTutores) totalTutores.textContent = tutores.length;
  if (totalTutorias) totalTutorias.textContent = tutorias.length;
  if (totalEstudiantes) totalEstudiantes.textContent = obtenerEstudiantes().length;
}

// Dibuja la tabla de estudiantes con el botón de eliminar.
function pintarEstudiantes() {
  const contenedor = document.getElementById("tabla-estudiantes");
  if (!contenedor) return;

  contenedor.innerHTML = "";
  const estudiantes = obtenerEstudiantes();

  if (estudiantes.length === 0) {
    const vacio = document.createElement("div");
    vacio.className = "fila-tabla";
    const celdaVacia = document.createElement("div");
    celdaVacia.className = "columna";
    celdaVacia.textContent = "Aún no hay estudiantes registrados.";
    vacio.appendChild(celdaVacia);
    contenedor.appendChild(vacio);
    return;
  }

  estudiantes.forEach((u) => {
    const fila = document.createElement("div");
    fila.className = "fila-tabla";

    [`${u.nombre} ${u.apellido}`, u.correo, u.telefono || "—"].forEach((texto) => {
      const celda = document.createElement("div");
      celda.className = "columna";
      celda.textContent = texto;
      fila.appendChild(celda);
    });

   const celdaAccion = document.createElement("div");
celdaAccion.className = "columna acciones-estudiante";

const botonBorrar = document.createElement("button");

botonBorrar.type = "button";
botonBorrar.className = "boton-eliminar-estudiante";
botonBorrar.title = "Eliminar estudiante";
botonBorrar.setAttribute(
    "aria-label",
    `Eliminar a ${u.nombre} ${u.apellido}`
);

// Texto visible para comprobar que el botón aparece
botonBorrar.textContent = "Eliminar";

botonBorrar.addEventListener("click", () => {
    if (confirm(`¿Eliminar a ${u.nombre} ${u.apellido}?`)) {
        eliminarUsuario(u.correo);
        pintarEstudiantes();
        actualizarMetricasTutores();
    }
});

celdaAccion.appendChild(botonBorrar);
fila.appendChild(celdaAccion);

    contenedor.appendChild(fila);
  });
}

// Actualiza las métricas al cargar el dashboard.
document.addEventListener("DOMContentLoaded", actualizarMetricasTutores);

// Actualiza las métricas cuando se registra una tutoría.
window.addEventListener("tutorias:cambio", actualizarMetricasTutores);


document.addEventListener("DOMContentLoaded", pintarEstudiantes);
document.addEventListener("DOMContentLoaded", actualizarMetricasTutores);