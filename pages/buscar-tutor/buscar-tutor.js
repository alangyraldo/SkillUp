// Los tutores vienen de js/tutores.js (se carga antes que este archivo)

const POR_PAGINA = 3;
let paginaActual = 1;

const lista = document.getElementById("listaTutores");
const paginacion = document.getElementById("paginacion");
const inputBuscar = document.getElementById("inputBuscar");
const filtros = {
  materia: document.getElementById("filtroMateria"),
  nivel: document.getElementById("filtroNivel"),
  precio: document.getElementById("filtroPrecio"),
  modalidad: document.getElementById("filtroModalidad")
};

const formatoCOP = (n) => "$" + n.toLocaleString("es-CO") + " Cop";

function filtrarTutores() {
  const texto = inputBuscar.value.trim().toLowerCase();
  return tutores.filter((t) => {
    const coincideTexto = !texto || t.nombre.toLowerCase().includes(texto) || t.materia.toLowerCase().includes(texto);
    const coincideMateria = !filtros.materia.value || t.materia === filtros.materia.value;
    const coincideNivel = !filtros.nivel.value || t.nivel === filtros.nivel.value;
    const coincidePrecio = !filtros.precio.value || t.precio <= Number(filtros.precio.value);
    const coincideModalidad = !filtros.modalidad.value || t.modalidad === filtros.modalidad.value;
    return coincideTexto && coincideMateria && coincideNivel && coincidePrecio && coincideModalidad;
  });
}

function crearCard(t) {
  return `
    <article class="card">
      <div class="card__foto">
        <img src="${t.foto}" alt="Foto de ${t.nombre}">
        <span class="card__estado">${t.modalidad}</span>
      </div>
      <div class="card__cuerpo">
        <p class="card__rating">★ ${t.rating} (${t.resenas} reseñas)</p>
        <h3 class="card__nombre">${t.nombre}</h3>
        <p class="card__materia">${t.materia}</p>
        <p class="card__nivel">${t.nivel}</p>
        <div class="card__pie">
          <span class="card__precio">${formatoCOP(t.precio)}</span>
          <a class="btn btn--primary" href="../perfil-tutor/index.html?tutor=${t.id}">Ver Perfil</a>
        </div>
      </div>
    </article>`;
}

function crearPaginacion(totalPaginas) {
  paginacion.innerHTML = "";
  if (totalPaginas <= 1) return;

  const boton = (texto, pagina, { activo = false, deshabilitado = false } = {}) => {
    const b = document.createElement("button");
    b.textContent = texto;
    if (activo) b.classList.add("activo");
    b.disabled = deshabilitado;
    b.addEventListener("click", () => { paginaActual = pagina; render(); });
    return b;
  };

  paginacion.appendChild(boton("‹", paginaActual - 1, { deshabilitado: paginaActual === 1 }));
  for (let i = 1; i <= totalPaginas; i++) {
    paginacion.appendChild(boton(i, i, { activo: i === paginaActual }));
  }
  paginacion.appendChild(boton("›", paginaActual + 1, { deshabilitado: paginaActual === totalPaginas }));
}

function render() {
  const resultado = filtrarTutores();
  const totalPaginas = Math.ceil(resultado.length / POR_PAGINA);
  if (paginaActual > totalPaginas) paginaActual = 1;

  const inicio = (paginaActual - 1) * POR_PAGINA;
  const pagina = resultado.slice(inicio, inicio + POR_PAGINA);

  lista.innerHTML = pagina.length
    ? pagina.map(crearCard).join("")
    : `<p class="tutores__vacio">No encontramos tutores con esos filtros. Prueba quitando alguno.</p>`;

  crearPaginacion(totalPaginas);
}

// Eventos
document.getElementById("formBuscador").addEventListener("submit", (e) => {
  e.preventDefault();
  paginaActual = 1;
  render();
});

Object.values(filtros).forEach((select) =>
  select.addEventListener("change", () => { paginaActual = 1; render(); })
);

document.getElementById("btnLimpiar").addEventListener("click", () => {
  Object.values(filtros).forEach((s) => (s.value = ""));
  inputBuscar.value = "";
  paginaActual = 1;
  render();
});

render();