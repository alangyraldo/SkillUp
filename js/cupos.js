/*
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

*/

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

  // Sincroniza las tutorías reales desde MySQL hacia localStorage
  async sincronizarDesdeBackend() {
    try {
      const listaJava = await apiRequest("/tutorias");
      const tutoresCache = JSON.parse(localStorage.getItem("skillup_tutores") || "[]");

      const mapeadas = (Array.isArray(listaJava) ? listaJava : []).map((t) => {
        const tutorObj = tutoresCache.find((tu) => String(tu.id) === String(t.idPerfilTutor));
        return {
          id: t.id,
          idPerfilTutor: t.idPerfilTutor,
          idMateria: t.idMateria,
          titulo: t.titulo,
          tutor: tutorObj ? tutorObj.nombre : "Tutor SkillUp",
          materia: tutorObj ? tutorObj.materia : "General",
          fecha: t.fecha,
          hora: t.horaInicio ? t.horaInicio.slice(0, 5) : "",
          duracionMinutos: t.duracionMinutos || 60,
          cupos: t.cupos ?? 0,
          precio: Number(t.precio || 0),
          modalidad: t.modalidad || "Virtual"
        };
      });

      this._guardar(mapeadas);
      return mapeadas;
    } catch (error) {
      console.error("Error sincronizando tutorías desde MySQL:", error);
      return this._leer();
    }
  },

  porTutor(nombreTutor) {
    return this._leer().filter((t) => t.tutor === nombreTutor);
  },

  descontar(idTutoria) {
    const lista = this._leer();
    const tutoria = lista.find((t) => String(t.id) === String(idTutoria));
    if (!tutoria || tutoria.cupos <= 0) return false;
    tutoria.cupos -= 1;
    this._guardar(lista);

    // Actualiza los cupos reales en MySQL en segundo plano
    apiRequest(`/tutorias/${tutoria.id}`, {
      method: "PUT",
      body: JSON.stringify({
        idPerfilTutor: tutoria.idPerfilTutor,
        idMateria: tutoria.idMateria,
        titulo: tutoria.titulo,
        fecha: tutoria.fecha,
        horaInicio: tutoria.hora.length === 5 ? `${tutoria.hora}:00` : tutoria.hora,
        duracionMinutos: tutoria.duracionMinutos || 60,
        cupos: tutoria.cupos,
        precio: tutoria.precio,
        modalidad: tutoria.modalidad
      })
    }).catch((err) => console.error("Error actualizando cupos en MySQL:", err));

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

// Carga las tutorías reales de MySQL al abrir cualquier página que use cupos.js
if (typeof apiRequest === "function") {
  Cupos.sincronizarDesdeBackend();
}
//----------------------------------------------------------------------------------


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

  /*
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
};*/

  // Devuelve "ok", "agotado" o "duplicada"
  reservar(idTutoria, correo, cantidad = 1) {
    const reservas = this._leer();

    if (reservas.some((r) => r.idTutoria === idTutoria && r.correo === correo)) {
      return "duplicada";
    }

    const tutoria = Cupos._leer().find((t) => t.id === idTutoria);

    if (!tutoria || Number(tutoria.cupos) < cantidad) {
      return "agotado";
    }

    for (let i = 0; i < cantidad; i++) {
      Cupos.descontar(idTutoria);
    }

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
      cantidad,
      modalidad: tutoria.modalidad
    });

    this._guardar(reservas);
    return "ok";
  },

  // Cancela la reserva y devuelve todos los cupos
  cancelar(idReserva) {
    const reservas = this._leer();
    const reserva = reservas.find((r) => r.id === idReserva);

    if (!reserva) return false;

    const cantidad = Number(reserva.cantidad) || 1;

    /*
    for (let i = 0; i < cantidad; i++) {
      Cupos.descontar; // No se utiliza para devolver cupos.
    }*/

    const tutorias = Cupos._leer();
    const tutoria = tutorias.find((t) => t.id === reserva.idTutoria);

    if (tutoria) {
      tutoria.cupos = Number(tutoria.cupos) + cantidad;
      Cupos._guardar(tutorias);
    }

    this._guardar(reservas.filter((r) => r.id !== idReserva));
    return true;
  }
};