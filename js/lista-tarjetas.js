// Lista de los 10 productos/tutorías iniciales
const tutoriasIniciales = [
  {
    id: 1,
    titulo: "Conversación Avanzada",
    materia: "Inglés",
    nivel: "Avanzado",
    descripcion: "Práctica intensiva y fluidez en inglés",
    tutor: "Sofía Vélez",
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
    fecha: "Martes",
    hora: "16:00",
    duracion: 2,
    modalidad: "En línea",
    precio: 40000,
    cupos: 20
  }
];

// Si el localStorage está vacío ("tutorias" no existe o no tiene elementos), se guardan estas 10 por defecto
if (!localStorage.getItem("tutorias") || JSON.parse(localStorage.getItem("tutorias")).length === 0) {
  localStorage.setItem("tutorias", JSON.stringify(tutoriasIniciales));
}