
/* Lista de las 10 tutorías iniciales con la foto de cada tutor */
const tutoriasIniciales = [
  {
    id: 1,
    titulo: "Conversación Avanzada",
    materia: "Inglés",
    nivel: "Avanzado",
    descripcion: "Práctica intensiva y fluidez en inglés",
    tutor: "Sofía Vélez",
    foto: "../incio/img/incio.jpg",
    fecha: "Martes",
    hora: "18:00",
    duracion: 2,
    modalidad: "En línea",
    precio: 55000,
    cupos: 20
  },
  {
    id: 2,
    titulo: "Fundamentos de Inglés",
    materia: "Inglés",
    nivel: "Intermedio",
    descripcion: "Estructuras gramaticales y vocabulario útil",
    tutor: "Laura Martínez",
    foto: "../incio/img/persona(2).jpg",
    fecha: "Lunes",
    hora: "17:00",
    duracion: 2,
    modalidad: "En línea",
    precio: 45000,
    cupos: 20
  },
  {
    id: 3,
    titulo: "Estrategias de Marketing Digital",
    materia: "Marketing digital",
    nivel: "Intermedio",
    descripcion: "Campañas efectivas en redes sociales",
    tutor: "Andrés Torres",
    foto: "../incio/img/persona.jpg",
    fecha: "Lunes",
    hora: "16:00",
    duracion: 2,
    modalidad: "En línea",
    precio: 50000,
    cupos: 20
  },
  {
    id: 4,
    titulo: "Growth Marketing Avanzado",
    materia: "Marketing digital",
    nivel: "Avanzado",
    descripcion: "Optimización de embudos de conversión",
    tutor: "Camila Rojas",
    foto: "../incio/img/persona(3).jpg",
    fecha: "Martes",
    hora: "19:00",
    duracion: 2,
    modalidad: "Híbrida",
    precio: 60000,
    cupos: 20
  },
  {
    id: 5,
    titulo: "Fotografía y Composición",
    materia: "Fotografía",
    nivel: "Avanzado",
    descripcion: "Manejo de luz y edición profesional",
    tutor: "Sara Giraldo",
    foto: "../incio/img/persona(4).jpg",
    fecha: "Lunes",
    hora: "09:00",
    duracion: 2,
    modalidad: "En línea",
    precio: 50000,
    cupos: 20
  },
  {
    id: 6,
    titulo: "Iniciación a la Fotografía",
    materia: "Fotografía",
    nivel: "Intermedio",
    descripcion: "Uso de cámara y encuadre básico",
    tutor: "Mateo Ruiz",
    foto: "../incio/img/tutor.jpg",
    fecha: "Jueves",
    hora: "15:00",
    duracion: 2,
    modalidad: "Presencial",
    precio: 45000,
    cupos: 20
  },
  {
    id: 7,
    titulo: "Inteligencia Artificial con Python",
    materia: "Programación",
    nivel: "Avanzado",
    descripcion: "Modelos de aprendizaje automático y redes neuronales",
    tutor: "Daniel Castro",
    foto: "../incio/img/persona.jpg",
    fecha: "Martes",
    hora: "18:00",
    duracion: 2,
    modalidad: "En línea",
    precio: 65000,
    cupos: 20
  },
  {
    id: 8,
    titulo: "Desarrollo de Algoritmos con IA",
    materia: "Programación",
    nivel: "Intermedio",
    descripcion: "Implementación de lógica y asistentes inteligentes",
    tutor: "Valentina Gómez",
    foto: "../incio/img/persona(2).jpg",
    fecha: "Miércoles",
    hora: "17:00",
    duracion: 2,
    modalidad: "En línea",
    precio: 55000,
    cupos: 20
  },
  {
    id: 9,
    titulo: "Álgebra Lineal Aplicada",
    materia: "Matemáticas",
    nivel: "Avanzado",
    descripcion: "Matrices, vectores y sistemas de ecuaciones",
    tutor: "Juan Pérez",
    foto: "../incio/img/persona(3).jpg",
    fecha: "Lunes",
    hora: "18:00",
    duracion: 2,
    modalidad: "En línea",
    precio: 50000,
    cupos: 20
  },
  {
    id: 10,
    titulo: "Teoría de Conjuntos y Lógica",
    materia: "Matemáticas",
    nivel: "Intermedio",
    descripcion: "Operaciones entre conjuntos y demostraciones matemáticas",
    tutor: "Natalia Díaz",
    foto: "../incio/img/persona(4).jpg",
    fecha: "Martes",
    hora: "16:00",
    duracion: 2,
    modalidad: "En línea",
    precio: 40000,
    cupos: 20
  }
];

// Guardar las tutorías iniciales solo si no existen o están vacías
const tutoriasGuardadas = localStorage.getItem("tutorias");

if (!tutoriasGuardadas || JSON.parse(tutoriasGuardadas).length === 0) {
  localStorage.setItem("tutorias", JSON.stringify(tutoriasIniciales));
}
