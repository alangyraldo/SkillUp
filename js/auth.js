const ADMIN = {
  correo: "admin@skillup.com",
  clave: "Admin1234",
  rol: "admin",
};

const CLAVE_SESION = "sesion";
const CLAVE_USUARIOS = "usuarios";

function leerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
  } catch (error) {
    return [];
  }
}

function registrarUsuario({ nombre, apellido, correo, clave, intencion }) {
  const correoLimpio = correo.trim().toLowerCase();
  if (correoLimpio === ADMIN.correo) {
    return { ok: false, error: "Ese correo no está disponible." };
  }
  const usuarios = leerUsuarios();
  if (usuarios.some((u) => u.correo === correoLimpio)) {
    return { ok: false, error: "Ya existe una cuenta con ese correo." };
  }
  usuarios.push({ nombre, apellido, correo: correoLimpio, clave, rol: "usuario", intencion });
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  return { ok: true };
}

// Devuelve la sesión si las credenciales son correctas, o null si no.
function iniciarSesion(correo, clave) {
  const correoLimpio = correo.trim().toLowerCase();
  let sesion = null;

  if (correoLimpio === ADMIN.correo && clave === ADMIN.clave) {
    sesion = { correo: ADMIN.correo, rol: ADMIN.rol, nombre: "Administrador" };
  } else {
    const usuario = leerUsuarios().find((u) => u.correo === correoLimpio && u.clave === clave);
    if (usuario) {
      sesion = { correo: usuario.correo, rol: usuario.rol, nombre: usuario.nombre };
    }
  }

  if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  return sesion;
}

function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch (error) {
    return null;
  }
}

function esAdmin() {
  const sesion = obtenerSesion();
  return sesion !== null && sesion.rol === "admin";
}

function rutaDashboard(rol) {
  return rol === "admin"
    ? "/pages/dashboard-admin/index.html"
    : "/pages/dashboard-usuario/index.html";
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}