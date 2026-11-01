// Datos de ejemplo compartidos por buscar-tutor y perfil-tutor.
// Se carga como script normal (no módulo) ANTES de buscar-tutor.js y perfil-tutor.js.

/* Catálogo inicial de tutores compartido entre los componentes de SkillUp. */

// Crea un tutor con sus datos personales, académicos y horarios.
function crearTutor(id, nombre, materia, nivel, precio, experiencia, modalidad, foto, horarios) {
  // Devuelve el objeto con toda la información del tutor.
  return {
    id, // Identificador único del tutor.
    nombre, // Nombre completo del tutor.
    materia, // Materia que puede enseñar.
    nivel, // Nivel de conocimiento que imparte.
    precio, // Precio de una tutoría.
    experiencia, // Años de experiencia del tutor.
    modalidad, // Modalidad de las clases.
    foto, // Ruta de la imagen del tutor.
    rating: 4.8, // Calificación inicial de ejemplo.
    resenas: 0, // Cantidad inicial de reseñas.
    idiomas: ["Español"], // Idiomas que domina el tutor.
    habilidades: [], // Habilidades específicas del tutor.
    descripcion: `Tutor especializado en ${materia}.`, // Descripción inicial del tutor.
    // Convierte los horarios recibidos en objetos con cupos.
    horarios: horarios.map((horario, indice) => ({
      id: `${id}-horario-${indice + 1}`, // Identificador único de cada horario.
      dia: horario.dia, // Día de la semana de la clase.
      hora: horario.hora, // Hora de inicio de la clase.
      cuposIniciales: 20, // Capacidad inicial del horario.
      cuposDisponibles: 20, // Cupos que quedan al comenzar.
      activo: true // Indica si el horario permite reservas.
    }))
  };
}

// Catálogo inicial con dos tutores por cada materia.
const tutores = [
  // Primer tutor de inglés.
  crearTutor(
    "sofia-velez", "Sofía Vélez", "Inglés", "Avanzado", 55000, "7 años", "En línea", "../incio/img/incio.jpg", [
    { dia: "Martes", hora: "18:00" }, // Horario del martes.
    { dia: "Jueves", hora: "19:00" } // Horario del jueves.
  ]),

  // Segundo tutor de inglés.
  crearTutor(
    "laura-martinez", "Laura Martínez", "Inglés", "Intermedio", 45000, "4 años", "En línea", "../incio/img/persona(2).jpg", [
    { dia: "Lunes", hora: "17:00" }, // Horario del lunes.
    { dia: "Sábado", hora: "09:00" } // Horario del sábado.
  ]),

  // Primer tutor de marketing digital.
  crearTutor(
    "andres-torres", "Andrés Torres", "Marketing digital", "Intermedio", 50000, "5 años", "En línea", "../incio/img/persona.jpg", [
    { dia: "Lunes", hora: "16:00" }, // Horario del lunes.
    { dia: "Miércoles", hora: "18:00" } // Horario del miércoles.
  ]),

  // Segundo tutor de marketing digital.
  crearTutor(
    "camila-rojas", "Camila Rojas", "Marketing digital", "Avanzado", 60000, "6 años", "Híbrida", "../incio/img/persona(3).jpg", [
    { dia: "Martes", hora: "19:00" }, // Horario del martes.
    { dia: "Viernes", hora: "17:00" } // Horario del viernes.
  ]),

  // Primer tutor de fotografía.
  crearTutor(
    "sara-giraldo", "Sara Giraldo", "Fotografía", "Avanzado", 50000, "6 años", "En línea", "../incio/img/persona(4).jpg", [
    { dia: "Lunes", hora: "09:00" }, // Horario del lunes.
    { dia: "Miércoles", hora: "10:00" } // Horario del miércoles.
  ]),

  // Segundo tutor de fotografía.
  crearTutor(
    "mateo-ruiz", "Mateo Ruiz", "Fotografía", "Intermedio", 45000, "3 años", "Presencial", "../incio/img/tutor.jpg", [
    { dia: "Jueves", hora: "15:00" }, // Horario del jueves.
    { dia: "Sábado", hora: "11:00" } // Horario del sábado.
  ]),

  // Primer tutor de programación.
  crearTutor(
    "daniel-castro", "Daniel Castro", "Programación", "Avanzado", 65000, "8 años", "En línea", "../incio/img/persona.jpg", [
    { dia: "Martes", hora: "18:00" }, // Horario del martes.
    { dia: "Jueves", hora: "20:00" } // Horario del jueves.
  ]),

  // Segundo tutor de programación.
  crearTutor(
    "valentina-gomez", "Valentina Gómez", "Programación", "Intermedio", 55000, "4 años", "En línea", "../incio/img/persona(2).jpg", [
    { dia: "Miércoles", hora: "17:00" }, // Horario del miércoles.
    { dia: "Sábado", hora: "10:00" } // Horario del sábado.
  ]),

  // Primer tutor de matemáticas.
  crearTutor(
    "juan-perez", "Juan Pérez", "Matemáticas", "Avanzado", 50000, "6 años", "En línea", "../incio/img/persona(3).jpg", [
    { dia: "Lunes", hora: "18:00" }, // Horario del lunes.
    { dia: "Viernes", hora: "16:00" } // Horario del viernes.
  ]),

  // Segundo tutor de matemáticas.
  crearTutor(
    "natalia-diaz", "Natalia Díaz", "Matemáticas", "Intermedio", 40000, "3 años", "En línea", "../incio/img/persona(4).jpg", [
    { dia: "Martes", hora: "16:00" }, // Horario del martes.
    { dia: "Sábado", hora: "08:00" } // Horario del sábado.
  ]),

  // Primer tutor de diseño gráfico.
  crearTutor(
    "mariana-lopez", "Mariana López", "Diseño gráfico", "Avanzado", 60000, "7 años", "Híbrida", "../incio/img/tutor.jpg", [
    { dia: "Miércoles", hora: "19:00" }, // Horario del miércoles.
    { dia: "Viernes", hora: "18:00" } // Horario del viernes.
  ]),

  // Segundo tutor de diseño gráfico.
  crearTutor(
    "felipe-moreno", "Felipe Moreno", "Diseño gráfico", "Intermedio", 50000, "4 años", "En línea", "../incio/img/persona.jpg", [
    { dia: "Jueves", hora: "17:00" }, // Horario del jueves.
    { dia: "Sábado", hora: "14:00" } // Horario del sábado.
  ])
];

/*cuando se abre Buscar tutor, recupera el catálogo guardado y lo combina con los tutores de ejemplo. 
Si el identificador de un tutor ya existe, actualiza sus datos en lugar de crear un duplicado.*/

function sincronizarTutoresDesdeStorage() {
    // Recupera el catálogo completo guardado por el administrador.
    const guardados = JSON.parse(localStorage.getItem("skillup_tutores") || "[]");

    // Conserva únicamente los tutores que siguen registrados.
    tutores.splice(0, tutores.length, ...guardados);

    // Devuelve el catálogo actualizado.
    return tutores;
}

// Sincroniza el catálogo al cargar la página.
sincronizarTutoresDesdeStorage();

// Detecta cambios realizados desde otra pestaña.
window.addEventListener("storage", evento => {
    if (evento.key === "skillup_tutores") {
        sincronizarTutoresDesdeStorage();
    }
});


