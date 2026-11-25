const API_BASE_URL = "http://localhost:8080/api";

async function apiRequest(endpoint, options = {}) {
  const sesion = typeof obtenerSesion === "function" ? obtenerSesion() : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (sesion && sesion.token) {
    headers["Authorization"] = `Bearer ${sesion.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401 && !endpoint.startsWith("/auth/")) {
    if (typeof cerrarSesion === "function") cerrarSesion();
    const prefijo = window.location.pathname.includes("/pages/") ? "../../" : "./";
    window.location.replace(`${prefijo}pages/iniciar-sesion/index.html`);
    throw new Error("Sesión expirada. Inicia sesión nuevamente.");
  }

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensajeError = (data && (data.mensaje || data.message)) || `Error HTTP ${response.status}`;
    throw new Error(mensajeError);
  }

  return data;
}