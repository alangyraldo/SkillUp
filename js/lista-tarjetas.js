// ==========================================
// Archivo: datos-ejemplo.js
// ==========================================


// 2. LISTA DE 10 NUEVAS TUTORÍAS DE EJEMPLO
const tutoriasEjemplo = [
{
    id: 1,
    titulo: "Inglés Conversacional y Fluidez Profesional",
    materia: "Inglés",
    nivel: "Avanzado",
    descripcion: "Práctica intensiva de expresión oral, vocabulario de negocios y reducción de acento.",
    tutor: "Sofía Vélez",
    tutorId: "sofia-velez",
    fecha: "Martes",
    hora: "18:00",
    duracion: 60,
    modalidad: "En línea",
    precio: 55000,
    cupos: 20,
    foto: "../incio/img/incio.jpg"
  },
  {
    id: 2,
    titulo: "Preparación para Exámenes Internacionales",
    materia: "Inglés",
    nivel: "Avanzado",
    descripcion: "Estrategias para comprensión lectora, redacción académica y simulacros de speaking.",
    tutor: "Sofía Vélez",
    tutorId: "sofia-velez",
    fecha: "Jueves",
    hora: "19:00",
    duracion: 90,
    modalidad: "En línea",
    precio: 55000,
    cupos: 20,
    foto: "../incio/img/incio.jpg"
  },
  {
    id: 3,
    titulo: "Gramática Práctica y Comprensión Auditiva",
    materia: "Inglés",
    nivel: "Intermedio",
    descripcion: "Consolidación de tiempos verbales, phrasal verbs y ejercicios de escucha activa.",
    tutor: "Laura Martínez",
    tutorId: "laura-martinez",
    fecha: "Lunes",
    hora: "17:00",
    duracion: 60,
    modalidad: "En línea",
    precio: 45000,
    cupos: 20,
    foto: "../incio/img/persona(2).jpg"
  },

  // --- MARKETING DIGITAL ---
  {
    id: 4,
    titulo: "Estrategia de Contenidos",
    materia: "Marketing digital",
    nivel: "Intermedio",
    descripcion: "Planificación de grillas de contenido, copywriting persuasivo y análisis de métricas orgánicas.",
    tutor: "Andrés Torres",
    tutorId: "andres-torres",
    fecha: "Lunes",
    hora: "16:00",
    duracion: 60,
    modalidad: "En línea",
    precio: 50000,
    cupos: 20,
    foto: "../incio/img/persona.jpg"
  },
  {
    id: 5,
    titulo: "Campañas de Pauta Digital en Meta Ads y Google Ads",
    materia: "Marketing digital",
    nivel: "Avanzado",
    descripcion: "Segmentación avanzada, optimización de presupuesto, embudos de conversión y retorno de inversión (ROAS).",
    tutor: "Camila Rojas",
    tutorId: "camila-rojas",
    fecha: "Martes",
    hora: "19:00",
    duracion: 90,
    modalidad: "Híbrida",
    precio: 60000,
    cupos: 20,
    foto: "../incio/img/persona(3).jpg"
  },
  {
    id: 6,
    titulo: "SEO Técnico y Posicionamiento Web",
    materia: "Marketing digital",
    nivel: "Avanzado",
    descripcion: "Auditoría de sitios web, arquitectura de información, investigación de palabras clave y link building.",
    tutor: "Camila Rojas",
    tutorId: "camila-rojas",
    fecha: "Viernes",
    hora: "17:00",
    duracion: 60,
    modalidad: "Híbrida",
    precio: 60000,
    cupos: 20,
    foto: "../incio/img/persona(3).jpg"
  },

  // --- FOTOGRAFÍA ---
  {
    id: 7,
    titulo: "Iluminación de Estudio y Retrato Editorial",
    materia: "Fotografía",
    nivel: "Avanzado",
    descripcion: "Esquemas de iluminación con flash, modificadores de luz y dirección de modelos.",
    tutor: "Sara Giraldo",
    tutorId: "sara-giraldo",
    fecha: "Lunes",
    hora: "09:00",
    duracion: 90,
    modalidad: "En línea",
    precio: 50000,
    cupos: 20,
    foto: "../incio/img/persona(4).jpg"
  },
  {
    id: 8,
    titulo: "Revelado Digital y Etalonaje en Lightroom",
    materia: "Fotografía",
    nivel: "Avanzado",
    descripcion: "Flujo de trabajo RAW, corrección de color profesional y creación de presets personalizados.",
    tutor: "Sara Giraldo",
    tutorId: "sara-giraldo",
    fecha: "Miércoles",
    hora: "10:00",
    duracion: 60,
    modalidad: "En línea",
    precio: 50000,
    cupos: 20,
    foto: "../incio/img/persona(4).jpg"
  },
  {
    id: 9,
    titulo: "Composición Fotográfica y Manejo Manual de Cámara",
    materia: "Fotografía",
    nivel: "Intermedio",
    descripcion: "Control creativo del triángulo de exposición, reglas de composición y fotografía urbana.",
    tutor: "Mateo Ruiz",
    tutorId: "mateo-ruiz",
    fecha: "Jueves",
    hora: "15:00",
    duracion: 90,
    modalidad: "Presencial",
    precio: 45000,
    cupos: 20,
    foto: "../incio/img/tutor.jpg"
  },

  // --- PROGRAMACIÓN ---
  {
    id: 10,
    titulo: "Arquitectura Backend y APIs RESTful con Node.js",
    materia: "Programación",
    nivel: "Avanzado",
    descripcion: "Diseño de servicios escalables, autenticación JWT, bases de datos y buenas prácticas.",
    tutor: "Daniel Castro",
    tutorId: "daniel-castro",
    fecha: "Martes",
    hora: "18:00",
    duracion: 90,
    modalidad: "En línea",
    precio: 65000,
    cupos: 20,
    foto: "../incio/img/persona.jpg"
  },
  {
    id: 11,
    titulo: "Estructuras de Datos, Algoritmos y Optimización",
    materia: "Programación",
    nivel: "Avanzado",
    descripcion: "Complejidad algorítmica (Big O), árboles, grafos y resolución de problemas técnicos.",
    tutor: "Daniel Castro",
    tutorId: "daniel-castro",
    fecha: "Jueves",
    hora: "20:00",
    duracion: 60,
    modalidad: "En línea",
    precio: 65000,
    cupos: 20,
    foto: "../incio/img/persona.jpg"
  },
  {
    id: 12,
    titulo: "Desarrollo Web Frontend Moderno con JavaScript",
    materia: "Programación",
    nivel: "Intermedio",
    descripcion: "Manipulación del DOM, programación asíncrona (Fetch/Async-Await) y consumo de APIs.",
    tutor: "Valentina Gómez",
    tutorId: "valentina-gomez",
    fecha: "Miércoles",
    hora: "17:00",
    duracion: 60,
    modalidad: "En línea",
    precio: 55000,
    cupos: 20,
    foto: "../incio/img/persona(2).jpg"
  },

  // --- MATEMÁTICAS ---
  {
    id: 13,
    titulo: "Cálculo Diferencial e Integral Aplicado",
    materia: "Matemáticas",
    nivel: "Avanzado",
    descripcion: "Límites, derivadas, técnicas de integración y resolución de problemas de optimización.",
    tutor: "Juan Pérez",
    tutorId: "juan-perez",
    fecha: "Lunes",
    hora: "18:00",
    duracion: 90,
    modalidad: "En línea",
    precio: 50000,
    cupos: 20,
    foto: "../incio/img/persona(3).jpg"
  },
  {
    id: 14,
    titulo: "Álgebra Lineal y Geometría Analítica",
    materia: "Matemáticas",
    nivel: "Avanzado",
    descripcion: "Matrices, determinantes, espacios vectoriales y transformaciones lineales.",
    tutor: "Juan Pérez",
    tutorId: "juan-perez",
    fecha: "Viernes",
    hora: "16:00",
    duracion: 60,
    modalidad: "En línea",
    precio: 50000,
    cupos: 20,
    foto: "../incio/img/persona(3).jpg"
  },
  {
    id: 15,
    titulo: "Fundamentos de Álgebra y Trigonometría",
    materia: "Matemáticas",
    nivel: "Intermedio",
    descripcion: "Factorización, ecuaciones cuadráticas, funciones trigonométricas e identidades.",
    tutor: "Natalia Díaz",
    tutorId: "natalia-diaz",
    fecha: "Martes",
    hora: "16:00",
    duracion: 60,
    modalidad: "En línea",
    precio: 40000,
    cupos: 20,
    foto: "../incio/img/persona(4).jpg"
  },

  // --- DISEÑO GRÁFICO ---
  {
    id: 16,
    titulo: "Identidad Visual y Sistemas de Branding",
    materia: "Diseño gráfico",
    nivel: "Avanzado",
    descripcion: "Conceptualización de marca, construcción de logotipos, retículas y manuales de identidad.",
    tutor: "Mariana López",
    tutorId: "mariana-lopez",
    fecha: "Miércoles",
    hora: "19:00",
    duracion: 90,
    modalidad: "Híbrida",
    precio: 60000,
    cupos: 20,
    foto: "../incio/img/tutor.jpg"
  },
  {
    id: 17,
    titulo: "Diseño Editorial y Tipografía Avanzada",
    materia: "Diseño gráfico",
    nivel: "Avanzado",
    descripcion: "Maquetación de revistas y libros, jerarquía tipográfica y preparación de artes finales.",
    tutor: "Mariana López",
    tutorId: "mariana-lopez",
    fecha: "Viernes",
    hora: "18:00",
    duracion: 60,
    modalidad: "Híbrida",
    precio: 60000,
    cupos: 20,
    foto: "../incio/img/tutor.jpg"
  },
  {
    id: 18,
    titulo: "Ilustración Vectorial y Composición en Illustrator",
    materia: "Diseño gráfico",
    nivel: "Intermedio",
    descripcion: "Dominio de pluma, manejo de color, sombreado vectorial y creación de piezas gráficas.",
    tutor: "Felipe Moreno",
    tutorId: "felipe-moreno",
    fecha: "Jueves",
    hora: "17:00",
    duracion: 60,
    modalidad: "En línea",
    precio: 50000,
    cupos: 20,
    foto: "../incio/img/persona.jpg"
  }
];

// 3. FUNCIONES PARA GUARDAR EN LOCALSTORAGE
function cargarDatosEjemploEnLocalStorage() {
  localStorage.setItem("skillup_tutores", JSON.stringify(tutoresEjemplo));
  localStorage.setItem("tutorias", JSON.stringify(tutoriasEjemplo));
  
  // Notificar a la aplicación que hubo un cambio en los datos
  window.dispatchEvent(new CustomEvent("tutorias:cambio"));
  console.log("¡Tutores y Tutorías de ejemplo guardados exitosamente en LocalStorage!");
}

// Cargar automáticamente solo si las listas están vacías
document.addEventListener("DOMContentLoaded", () => {
  const tutoresActuales = localStorage.getItem("skillup_tutores");
  const tutoriasActuales = localStorage.getItem("tutorias");

  if (!tutoresActuales || JSON.parse(tutoresActuales).length === 0) {
    localStorage.setItem("skillup_tutores", JSON.stringify(tutoresEjemplo));
  }

  if (!tutoriasActuales || JSON.parse(tutoriasActuales).length === 0) {
    localStorage.setItem("tutorias", JSON.stringify(tutoriasEjemplo));
  }

  window.dispatchEvent(new CustomEvent("tutorias:cambio"));
});