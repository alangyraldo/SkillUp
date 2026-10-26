// Cupos compartidos: leen y escriben la misma lista "tutorias" que usa el dashboard admin.
const CLAVE_TUTORIAS = "tutorias";

const Cupos = {
  _leer() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_TUTORIAS)) || [];
    } catch (error) {
      return [];
    }
  },

  _guardar(lista) {
    localStorage.setItem(CLAVE_TUTORIAS, JSON.stringify(lista));
    window.dispatchEvent(new CustomEvent("cupos:cambio"));
  },

  porTutor(nombreTutor) {
    return this._leer().filter((t) => t.tutor === nombreTutor);
  },

  descontar(idTutoria) {
    const lista = this._leer();
    const tutoria = lista.find((t) => t.id === idTutoria);
    if (!tutoria || tutoria.cupos <= 0) return false;
    tutoria.cupos -= 1;
    this._guardar(lista);
    return true;
  },

  resumen(nombreTutor) {
    const sesiones = this.porTutor(nombreTutor);
    const total = sesiones.reduce((suma, s) => suma + s.cupos, 0);
    return { sesiones, total, agotado: sesiones.length > 0 && total <= 0 };
  },

  etiqueta(nombreTutor) {
    const { sesiones, total, agotado } = this.resumen(nombreTutor);
    if (!sesiones.length) return "Sin tutorías programadas";
    return agotado ? "Sin cupos" : `${total} cupos`;
  }
};

window.addEventListener("storage", (evento) => {
  if (evento.key === CLAVE_TUTORIAS) {
    window.dispatchEvent(new CustomEvent("cupos:cambio"));
  }
});