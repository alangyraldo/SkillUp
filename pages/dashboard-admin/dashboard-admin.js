// Hidrata el avatar del administrador desde la sesión persistida.
(function cargarAvatarAdministrador() {
  const ses = typeof obtenerSesion === 'function' ? obtenerSesion() : null;
  const avatar = document.getElementById('usuario-avatar');
  if (!avatar || !ses) return;
  if (ses.foto) {
    avatar.textContent = '';
    avatar.style.backgroundImage = `url("${ses.foto}")`;
    avatar.style.backgroundSize = 'cover';
    avatar.style.backgroundPosition = 'center';
  } else {
    avatar.textContent = (ses.nombre || 'A').charAt(0).toUpperCase();
  }
})();

// Protege la vista: si no es admin, vuelve al login

/*
if (!esAdmin()) {
  window.location.replace('../../pages/iniciar-sesion/index.html');
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
      window.location.href = '../../pages/iniciar-sesion/index.html';
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
        <label>Fotografía de perfil<input name="fotoPerfil" type="file" accept="image/*"></label>
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

*/

// Nueva funcion para que guarde los usuarios en la base de datos

if (!esAdmin()) {
  window.location.replace('../../pages/iniciar-sesion/index.html');
}

let cacheUsuarios = [];

document.addEventListener('DOMContentLoaded', async function () {
  const sesion = obtenerSesion();
  const spanCorreo = document.getElementById('admin-correo');
  if (sesion && spanCorreo) {
    spanCorreo.textContent = sesion.correo;
  }

  const btnCerrarSesion = document.getElementById('btn-cerrar-sesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', function () {
      cerrarSesion();
      window.location.href = '../../pages/iniciar-sesion/index.html';
    });
  }

  await refrescarDatosAdmin();
});

async function refrescarDatosAdmin() {
  try {
    cacheUsuarios = await apiRequest('/usuarios');
  } catch (error) {
    console.error('Error al cargar usuarios desde el backend:', error);
    cacheUsuarios = [];
  }
  pintarEstudiantes();
  actualizarMetricasTutores();
}

// Actualiza los contadores del administrador.
function actualizarMetricasTutores() {
  const tutores = JSON.parse(localStorage.getItem('skillup_tutores') || '[]');
  const tutorias = JSON.parse(localStorage.getItem('tutorias') || '[]');
  const estudiantes = cacheUsuarios.filter((u) => u.tipoUsuario === 'ESTUDIANTE');

  const totalTutores = document.getElementById('total-tutores-admin');
  const totalTutorias = document.getElementById('total-tutorias-admin');
  const totalEstudiantes = document.getElementById('total-estudiantes-admin');

  if (totalTutores) totalTutores.textContent = tutores.length;
  if (totalTutorias) totalTutorias.textContent = tutorias.length;
  if (totalEstudiantes) totalEstudiantes.textContent = estudiantes.length;
}

// Dibuja la tabla de estudiantes reales con el botón de eliminar.
function pintarEstudiantes() {
  const contenedor = document.getElementById('tabla-estudiantes');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  const estudiantes = cacheUsuarios.filter((u) => u.tipoUsuario === 'ESTUDIANTE');

  if (estudiantes.length === 0) {
    const vacio = document.createElement('div');
    vacio.className = 'fila-tabla';
    const celdaVacia = document.createElement('div');
    celdaVacia.className = 'columna';
    celdaVacia.textContent = 'Aún no hay estudiantes registrados.';
    vacio.appendChild(celdaVacia);
    contenedor.appendChild(vacio);
    return;
  }

  estudiantes.forEach((u) => {
    const fila = document.createElement('div');
    fila.className = 'fila-tabla';

    [`${u.nombre} ${u.apellido}`, u.email, u.telefono || '—'].forEach((texto) => {
      const celda = document.createElement('div');
      celda.className = 'columna';
      celda.textContent = texto;
      fila.appendChild(celda);
    });

    const celdaAccion = document.createElement('div');
    celdaAccion.className = 'columna acciones-estudiante';

    const botonBorrar = document.createElement('button');
    botonBorrar.type = 'button';
    botonBorrar.className = 'boton-eliminar-estudiante';
    botonBorrar.title = 'Eliminar estudiante';
    botonBorrar.setAttribute('aria-label', `Eliminar a ${u.nombre} ${u.apellido}`);
    botonBorrar.textContent = 'Eliminar';

    botonBorrar.addEventListener('click', async () => {
      if (await confirmarAviso(`¿Eliminar a ${u.nombre} ${u.apellido}?`, 'Esta acción no se puede deshacer.', 'Eliminar')) {
        try {
          await apiRequest(`/usuarios/${u.id}`, { method: 'DELETE' });
          await refrescarDatosAdmin();
        } catch (error) {
          alert(error.message || 'No se pudo eliminar el estudiante.');
        }
      }
    });

    celdaAccion.appendChild(botonBorrar);
    fila.appendChild(celdaAccion);
    contenedor.appendChild(fila);
  });
}

window.addEventListener('tutorias:cambio', actualizarMetricasTutores);

// Modal de Configuración de Perfil Admin conectado a PUT /api/usuarios/{id}

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
        <label>Fotografía de perfil<input name="fotoPerfil" type="file" accept="image/*"></label>
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
          contrasenaNueva: claveNueva || null,
          foto: f.fotoPerfil.files[0] ? await archivoADataUrl(f.fotoPerfil.files[0]) : undefined
        })
      });

      const cambioCorreo = actualizado.email.toLowerCase() !== ses.correo.toLowerCase();

      localStorage.setItem(CLAVE_SESION, JSON.stringify({
        ...ses,
        nombre: actualizado.nombre,
        apellido: actualizado.apellido,
        telefono: actualizado.telefono,
        correo: actualizado.email,
        foto: actualizado.foto || ses.foto || null
      }));

      const spanAdmin = document.getElementById('admin-correo');
      if (spanAdmin) spanAdmin.textContent = actualizado.email;

      const spanUsuario = document.getElementById('usuario-nombre');
      if (spanUsuario) spanUsuario.textContent = actualizado.nombre;

      const avatarUsuario = document.getElementById('usuario-avatar');
      if (avatarUsuario) {
        if (actualizado.foto) {
          avatarUsuario.textContent = '';
          avatarUsuario.style.backgroundImage = `url("${actualizado.foto}")`;
          avatarUsuario.style.backgroundSize = 'cover';
          avatarUsuario.style.backgroundPosition = 'center';
        } else {
          avatarUsuario.style.backgroundImage = '';
          avatarUsuario.textContent = actualizado.nombre.charAt(0).toUpperCase();
        }
      }

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