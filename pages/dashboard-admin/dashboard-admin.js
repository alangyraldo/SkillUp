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


// Botón de configuracion (recordar que si el admin quiere cambiar de usuario y contraseña solo se hará en el localStorage porque
// este está guardado como una constante en el archivo auth.js)

(function () {
  if (!esAdmin()) return;

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
    form.reset();
    ['nombre', 'apellido', 'telefono', 'correo'].forEach((k) => (f[k].value = ADMIN[k] || ''));
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

  enlaceCfg.addEventListener('click', (e) => { e.preventDefault(); abrir(); });
  document.getElementById('cfg-cerrar').addEventListener('click', cerrar);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = f.nombre.value.trim();
    const correo = f.correo.value.trim().toLowerCase();
    const telefono = f.telefono.value.replace(/\D/g, '');
    const nueva = f.claveNueva.value;

    const error =
      !nombre ? 'El nombre es obligatorio.' :
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) ? 'Ingresa un correo válido.' :
      leerUsuarios().some((u) => u.correo === correo) ? 'Ese correo ya pertenece a un usuario.' :
      telefono && telefono.length < 7 ? 'Ingresa un teléfono válido.' :
      nueva && f.claveActual.value !== ADMIN.clave ? 'La contraseña actual es incorrecta.' :
      nueva && nueva.length < 8 ? 'La nueva contraseña debe tener mínimo 8 caracteres.' :
      nueva !== f.claveConfirmar.value ? 'Las contraseñas no coinciden.' : '';

    msg.className = 'cfg-msg ' + (error ? 'error' : 'ok');
    if (error) { msg.textContent = error; return; }

    const perfil = { nombre, apellido: f.apellido.value.trim(), telefono, correo, clave: nueva || ADMIN.clave };
    localStorage.setItem('adminPerfil', JSON.stringify(perfil));
    Object.assign(ADMIN, perfil);
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ ...obtenerSesion(), correo, nombre }));

    document.getElementById('admin-correo').textContent = correo;
    msg.textContent = 'Cambios guardados correctamente.';
    f.claveActual.value = f.claveNueva.value = f.claveConfirmar.value = '';
  });
})();