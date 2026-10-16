// Datos de ejemplo compartidos por buscar-tutor y perfil-tutor.
// Se carga como script normal (no módulo) ANTES de buscar-tutor.js y perfil-tutor.js.
const tutores = [
  {
    id: "sara-giraldo",
    nombre: "Sara Giraldo",
    materia: "Fotografía",
    nivel: "Avanzado",
    precio: 45000,
    modalidad: "En línea",
    rating: 4.9,
    resenas: 48,
    foto: "../../assets/images/tutores/sara.jpg",
    experiencia: "6 años",
    idiomas: ["Español", "Inglés"],
    habilidades: ["Retrato", "Edición en Lightroom", "Iluminación", "Composición"],
    descripcion: "Fotógrafa profesional con experiencia en retrato y fotografía de producto. Te acompaño desde los fundamentos de la cámara hasta la edición final de tus proyectos.",
    disponibilidad: "Lunes a viernes, 4:00 p. m. a 8:00 p. m."
  },
  {
    id: "daniel-rojas",
    nombre: "Daniel Rojas",
    materia: "Desarrollador Web",
    nivel: "Intermedio",
    precio: 55000,
    modalidad: "En línea",
    rating: 4.8,
    resenas: 36,
    foto: "../../assets/images/tutores/daniel.jpg",
    experiencia: "5 años",
    idiomas: ["Español", "Inglés"],
    habilidades: ["HTML y CSS", "JavaScript", "Bootstrap", "Git y GitHub"],
    descripcion: "Desarrollador web que disfruta enseñar con proyectos reales. Practicamos juntos hasta que puedas publicar tu propio sitio.",
    disponibilidad: "Martes a sábado, 6:00 p. m. a 9:00 p. m."
  },
  {
    id: "camila-torres",
    nombre: "Camila Torres",
    materia: "Marketing Digital",
    nivel: "Principiante",
    precio: 50000,
    modalidad: "En línea",
    rating: 4.7,
    resenas: 22,
    foto: "../../assets/images/tutores/camila.jpg",
    experiencia: "4 años",
    idiomas: ["Español"],
    habilidades: ["Redes sociales", "Estrategia de marca", "Analítica", "Contenido"],
    descripcion: "Especialista en marketing digital para emprendedores. Te ayudo a construir una estrategia clara y medible desde cero.",
    disponibilidad: "Lunes, miércoles y viernes, 9:00 a. m. a 1:00 p. m."
  }
];