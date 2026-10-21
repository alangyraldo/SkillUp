const ADMIN = {
  correo: "admin@skillup.com",
  clave: "Admin1234",
  rol: "admin",
};

const CLAVE_SESION = "sesion";

function iniciarSesion(correo, clave) {
  const correoLimpio = correo.trim().toLowerCase();

  if (correoLimpio === ADMIN.correo && clave === ADMIN.clave) {
    const sesion = { correo: ADMIN.correo, rol: ADMIN.rol };
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return true;
  }
  return false;
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

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}