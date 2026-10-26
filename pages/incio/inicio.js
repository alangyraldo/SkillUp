function pintarCupos() {
  document.querySelectorAll("[data-cupos-tutor]").forEach((el) => {
    const nombre = el.dataset.cuposTutor;
    el.textContent = Cupos.etiqueta(nombre);
    el.classList.toggle("sin-cupos", Cupos.resumen(nombre).agotado);
  });
}

pintarCupos();
window.addEventListener("cupos:cambio", pintarCupos);