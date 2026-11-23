const ADMIN = {
  correo: "admin@skillup.com",
  clave: "Admin1234",
  rol: "admin",
};

// logica de botón configuracion del dashboard admin
const perfilAdmin = JSON.parse(localStorage.getItem("adminPerfil") || "null");
if (perfilAdmin) Object.assign(ADMIN, perfilAdmin);

const CLAVE_SESION = "sesion";
const CLAVE_USUARIOS = "usuarios";

function leerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
  } catch (error) {
    return [];
  }
}

function registrarUsuario({ nombre, apellido, correo, telefono, clave, intencion }) {
  const correoLimpio = correo.trim().toLowerCase();
  if (correoLimpio === ADMIN.correo) {
    return { ok: false, error: "Ese correo no está disponible." };
  }
  const usuarios = leerUsuarios();
  if (usuarios.some((u) => u.correo === correoLimpio)) {
    return { ok: false, error: "Ya existe una cuenta con ese correo." };
  }
  usuarios.push({ nombre, apellido, correo: correoLimpio, telefono: (telefono || "").replace(/\D/g, ""), clave, rol: "usuario", intencion });
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
      sesion = { correo: usuario.correo, rol: usuario.rol, nombre: usuario.nombre, intencion: usuario.intencion };
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
  // Un href escrito desde JS se resuelve respecto a la página abierta, no respecto a auth.js.
  // Por eso se calcula el prefijo según la profundidad, igual que hace app.js con ROOT.
  const prefijo = window.location.pathname.includes("/pages/") ? "../../" : "./";
  return rol === "admin"
    ? prefijo + "pages/dashboard-admin/index.html"
    : prefijo + "pages/dashboard-usuario/index.html";
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

function obtenerEstudiantes() {
  return leerUsuarios().filter((u) => u.intencion === "aprender");
}

function eliminarUsuario(correo) {
  if (!esAdmin()) return { ok: false, error: "No tienes permiso." };
  const restantes = leerUsuarios().filter((u) => u.correo !== correo);
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(restantes));
  return { ok: true };
}