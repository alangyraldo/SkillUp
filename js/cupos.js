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

const CLAVE_RESERVAS = "reservas";

const Reservas = {
  _leer() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_RESERVAS)) || [];
    } catch (error) {
      return [];
    }
  },

  _guardar(lista) {
    localStorage.setItem(CLAVE_RESERVAS, JSON.stringify(lista));
  },

  porUsuario(correo) {
    return this._leer().filter((r) => r.correo === correo);
  },

  // Devuelve "ok", "agotado" o "duplicada"
  reservar(idTutoria, correo) {
    const reservas = this._leer();
    if (reservas.some((r) => r.idTutoria === idTutoria && r.correo === correo)) {
      return "duplicada";
    }

    const tutoria = Cupos._leer().find((t) => t.id === idTutoria);
    if (!tutoria || !Cupos.descontar(idTutoria)) return "agotado";

    reservas.push({
      id: Date.now(),
      idTutoria,
      correo,
      titulo: tutoria.titulo || tutoria.materia,
      tutor: tutoria.tutor,
      materia: tutoria.materia,
      fecha: tutoria.fecha,
      hora: tutoria.hora,
      precio: Number(tutoria.precio || 0),
      modalidad: tutoria.modalidad
    });
    this._guardar(reservas);
    return "ok";
  },

  // Cancela la reserva y devuelve el cupo
  cancelar(idReserva) {
    const reservas = this._leer();
    const reserva = reservas.find((r) => r.id === idReserva);
    if (!reserva) return false;

    const tutorias = Cupos._leer();
    const tutoria = tutorias.find((t) => t.id === reserva.idTutoria);
    if (tutoria) {
      tutoria.cupos += 1;
      Cupos._guardar(tutorias);
    }
    this._guardar(reservas.filter((r) => r.id !== idReserva));
    return true;
  }
};