// ==========================================
// Archivo: datos-ejemplo.js
// ==========================================

// 1. LISTA DE 5 TUTORES DE EJEMPLO
const tutoresEjemplo = [
  {
    id: "tutor-101",
    nombre: "Carlos Mendoza",
    materia: "Matemáticas",
    nivel: "Avanzado",
    precio: 35000,
    experiencia: 5,
    modalidad: "Virtual",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    rating: 4.9,
    resenas: 12,
    idiomas: ["Español", "Inglés"],
    habilidades: ["Cálculo integral", "Álgebra lineal"],
    descripcion: "Tutor de matemáticas avanzadas enfocado en métodos prácticos de resolución de problemas.",
    horarios: [
      { id: "tutor-101-h1", dia: "Lunes", hora: "08:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true },
      { id: "tutor-101-h2", dia: "Miércoles", hora: "14:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true }
    ]
  },
  {
    id: "tutor-102",
    nombre: "Valentina Gómez",
    materia: "Programación",
    nivel: "Universitario",
    precio: 55000,
    experiencia: 4,
    modalidad: "Virtual",
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
    rating: 5.0,
    resenas: 18,
    idiomas: ["Español"],
    habilidades: ["JavaScript", "Python", "React"],
    descripcion: "Ingeniera de software apasionada por la enseñanza de desarrollo web y lógica de programación.",
    horarios: [
      { id: "tutor-102-h1", dia: "Martes", hora: "10:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true },
      { id: "tutor-102-h2", dia: "Jueves", hora: "16:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true }
    ]
  },
  {
    id: "tutor-103",
    nombre: "Andrés Felipe Ríos",
    materia: "Física",
    nivel: "Intermedio",
    precio: 40000,
    experiencia: 3,
    modalidad: "Presencial",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    rating: 4.7,
    resenas: 8,
    idiomas: ["Español"],
    habilidades: ["Mecánica clásica", "Termodinámica"],
    descripcion: "Especialista en preparación de exámenes universitarios de física y física mecánica.",
    horarios: [
      { id: "tutor-103-h1", dia: "Lunes", hora: "16:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true },
      { id: "tutor-103-h2", dia: "Viernes", hora: "09:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true }
    ]
  },
  {
    id: "tutor-104",
    nombre: "Mariana Torres",
    materia: "Inglés",
    nivel: "Avanzado",
    precio: 45000,
    experiencia: 6,
    modalidad: "Híbrida",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    rating: 4.9,
    resenas: 25,
    idiomas: ["Español", "Inglés"],
    habilidades: ["Conversación", "Preparación TOEFL/IELTS"],
    descripcion: "Clases dinámicas centradas en fluidez verbal y preparación de certificaciones internacionales.",
    horarios: [
      { id: "tutor-104-h1", dia: "Martes", hora: "15:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true },
      { id: "tutor-104-h2", dia: "Sábado", hora: "10:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true }
    ]
  },
  {
    id: "tutor-105",
    nombre: "Santiago Castro",
    materia: "Química",
    nivel: "Básico",
    precio: 30000,
    experiencia: 2,
    modalidad: "Virtual",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    rating: 4.6,
    resenas: 5,
    idiomas: ["Español"],
    habilidades: ["Química orgánica", "Estequiometría"],
    descripcion: "Apoyo escolar y universitario para entender las bases de la química desde cero.",
    horarios: [
      { id: "tutor-105-h1", dia: "Miércoles", hora: "09:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true },
      { id: "tutor-105-h2", dia: "Jueves", hora: "11:00", cuposIniciales: 20, cuposDisponibles: 20, activo: true }
    ]
  }
];

// 2. LISTA DE 10 NUEVAS TUTORÍAS DE EJEMPLO
const tutoriasEjemplo = [
  {
    id: 1,
    titulo: "Cálculo Diferencial e Integral desde Cero",
    materia: "Matemáticas",
    nivel: "Avanzado",
    descripcion: "Aprende a resolver límites, derivadas e integrales paso a paso con ejercicios prácticos.",
    tutor: "Carlos Mendoza",
    fecha: "Lunes",
    hora: "08:00",
    duracion: 60,
    modalidad: "Virtual",
    precio: 35000,
    cupos: 15,
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    titulo: "Álgebra Lineal y Matrices",
    materia: "Matemáticas",
    nivel: "Avanzado",
    descripcion: "Dominio de vectores, matrices, determinantes y sistemas de ecuaciones lineales.",
    tutor: "Carlos Mendoza",
    fecha: "Miércoles",
    hora: "14:00",
    duracion: 120,
    modalidad: "Virtual",
    precio: 35000,
    cupos: 10,
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    titulo: "Fundamentos de Programación con Python",
    materia: "Programación",
    nivel: "Universitario",
    descripcion: "Aprende sintaxis, variables, condicionales, bucles y estructuras de datos básicas.",
    tutor: "Valentina Gómez",
    fecha: "Martes",
    hora: "10:00",
    duracion: 60,
    modalidad: "Virtual",
    precio: 55000,
    cupos: 20,
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    titulo: "Desarrollo Web Frontend con React.js",
    materia: "Programación",
    nivel: "Universitario",
    descripcion: "Crea componentes interactivos, manejo de estado y consumo de APIs en React.",
    tutor: "Valentina Gómez",
    fecha: "Jueves",
    hora: "16:00",
    duracion: 120,
    modalidad: "Virtual",
    precio: 55000,
    cupos: 8,
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    titulo: "Física Mecánica y Leyes de Newton",
    materia: "Física",
    nivel: "Intermedio",
    descripcion: "Resolución de problemas de cinemática, dinámica y trabajo y energía.",
    tutor: "Andrés Felipe Ríos",
    fecha: "Lunes",
    hora: "16:00",
    duracion: 60,
    modalidad: "Presencial",
    precio: 40000,
    cupos: 12,
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 6,
    titulo: "Termodinámica y Fluidos",
    materia: "Física",
    nivel: "Intermedio",
    descripcion: "Estudio de las leyes de la termodinámica, calorimetría y mecánica de fluidos.",
    tutor: "Andrés Felipe Ríos",
    fecha: "Viernes",
    hora: "09:00",
    duracion: 90,
    modalidad: "Presencial",
    precio: 40000,
    cupos: 5,
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 7,
    titulo: "Inglés Conversacional Intermedio",
    materia: "Inglés",
    nivel: "Avanzado",
    descripcion: "Mejora tu fluidez, pronunciación y vocabulario para situaciones de la vida real.",
    tutor: "Mariana Torres",
    fecha: "Martes",
    hora: "15:00",
    duracion: 60,
    modalidad: "Híbrida",
    precio: 45000,
    cupos: 18,
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 8,
    titulo: "Preparación Examen IELTS / TOEFL",
    materia: "Inglés",
    nivel: "Avanzado",
    descripcion: "Estrategias de resolución para las secciones de Listening, Reading, Speaking y Writing.",
    tutor: "Mariana Torres",
    fecha: "Sábado",
    hora: "10:00",
    duracion: 120,
    modalidad: "Híbrida",
    precio: 45000,
    cupos: 6,
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 9,
    titulo: "Química General y Estequiometría",
    materia: "Química",
    nivel: "Básico",
    descripcion: "Balanceo de ecuaciones, concepto de mol y cálculos de reactivo límite.",
    tutor: "Santiago Castro",
    fecha: "Miércoles",
    hora: "09:00",
    duracion: 60,
    modalidad: "Virtual",
    precio: 30000,
    cupos: 14,
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: 10,
    titulo: "Introducción a la Química Orgánica",
    materia: "Química",
    nivel: "Básico",
    descripcion: "Nomenclatura de hidrocarburos, grupos funcionales e isomería básica.",
    tutor: "Santiago Castro",
    fecha: "Jueves",
    hora: "11:00",
    duracion: 90,
    modalidad: "Virtual",
    precio: 30000,
    cupos: 10,
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
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