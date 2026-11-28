/*

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

*/


// FETCH para conectar back con front 

const CLAVE_SESION = "sesion";

// Registro de usuario en MySQL (POST /api/auth/registro)
async function registrarUsuario({ nombre, apellido, correo, telefono, clave, intencion, foto }) {
  try {
    const tipoUsuarioJava = intencion !== "aprender" ? "ADMIN_TUTOR" : "ESTUDIANTE";

    const usuarioCreado = await apiRequest("/auth/registro", {
      method: "POST",
      body: JSON.stringify({
        nombre: nombre,
        apellido: apellido,
        email: correo.trim().toLowerCase(),
        contrasena: clave,
        tipoUsuario: tipoUsuarioJava,
        telefono: (telefono || "").replace(/\D/g, ""),
        foto: foto || null
      })
    });

    return { ok: true, usuario: usuarioCreado };
  } catch (error) {
    return { ok: false, error: error.message || "Error al registrar usuario." };
  }
}

// Inicio de sesión contra MySQL + JWT (POST /api/auth/login)
async function iniciarSesion(correo, clave) {
  try {
    const datosJava = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: correo.trim().toLowerCase(),
        contrasena: clave
      })
    });

    const sesion = {
      id: datosJava.id,
      nombre: datosJava.nombre,
      apellido: datosJava.apellido,
      correo: datosJava.email,
      telefono: datosJava.telefono,
      foto: datosJava.foto || null,
      tipoUsuario: datosJava.tipoUsuario,
      token: datosJava.token,
      rol: datosJava.tipoUsuario === "ADMIN_TUTOR" ? "admin" : "usuario",
      intencion: datosJava.tipoUsuario === "ADMIN_TUTOR" ? "ensenar" : "aprender"
    };

    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    return sesion;
  } catch (error) {
    console.error("Error en login:", error.message);
    return null;
  }
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
  const prefijo = window.location.pathname.includes("/pages/") ? "../../" : "./";
  return rol === "admin"
    ? prefijo + "pages/dashboard-admin/index.html"
    : prefijo + "pages/dashboard-usuario/index.html";
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}

// Convierte una imagen seleccionada en Data URL para persistirla en MySQL.
function archivoADataUrl(archivo) {
  return new Promise((resolve, reject) => {
    if (!archivo) return resolve(null);
    if (!archivo.type || !archivo.type.startsWith('image/')) return reject(new Error('Selecciona un archivo de imagen válido.'));
    if (archivo.size > 2 * 1024 * 1024) return reject(new Error('La imagen original no debe superar 2 MB.'));
    const lector = new FileReader();
    lector.onerror = () => reject(new Error('No se pudo leer la imagen seleccionada.'));
    lector.onload = () => {
      const imagen = new Image();
      imagen.onerror = () => reject(new Error('El archivo seleccionado no es una imagen válida.'));
      imagen.onload = () => {
        const escala = Math.min(1, 900 / Math.max(imagen.width, imagen.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(imagen.width * escala));
        canvas.height = Math.max(1, Math.round(imagen.height * escala));
        canvas.getContext('2d').drawImage(imagen, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      imagen.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}
