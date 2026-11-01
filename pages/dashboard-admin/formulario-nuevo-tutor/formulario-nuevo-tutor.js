const CLAVE_LOCAL_STORAGE_TUTORES = 'skillup_tutores';

const elementoBotonAbrirModalNuevoTutor = document.getElementById('boton-nuevo-tutor');
const elementoModalSuperposicion = document.getElementById('modal-superposicion-nuevo-tutor');
const elementoBotonCerrarModalEncabezado = document.getElementById('boton-cerrar-modal-encabezado');
const elementoBotonCancelarModalTutor = document.getElementById('boton-cancelar-modal-tutor');
const elementoFormularioRegistroTutor = document.getElementById('formulario-registro-nuevo-tutor');

const elementoCampoSubidaFotoTutor = document.getElementById('campo-subida-foto-tutor');
const elementoVistaPreviaFotoTutor = document.getElementById('vista-previa-foto-tutor');
const elementoBotonAgregarNuevoHorario = document.getElementById('boton-agregar-nuevo-horario-tutor');
const elementoContenedorListaHorarios = document.getElementById('contenedor-lista-horarios-tutor');

// Paginación de Tutores en Admin (Máximo 3)
const POR_PAGINA_ADMIN = 3;
let paginaActualAdminTutores = 1;

let cadenaFotoPerfilEnBase64 = null;
let idTutorEnEdicion = null;

function abrirModalNuevoTutor() {
  elementoModalSuperposicion.classList.remove('modal-oculto');
}

function cerrarModalNuevoTutor() {
  elementoModalSuperposicion.classList.add('modal-oculto');
  elementoFormularioRegistroTutor.reset();
  cadenaFotoPerfilEnBase64 = null;
  idTutorEnEdicion = null;
  
  const tituloModal = elementoModalSuperposicion.querySelector('.modal-titulo-nuevo-tutor');
  if (tituloModal) tituloModal.textContent = "Nuevo tutor";

  elementoVistaPreviaFotoTutor.style.backgroundImage = '';
  elementoVistaPreviaFotoTutor.innerHTML = `
    <svg class="icono-marcador-posicion-foto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>`;
}

if (elementoBotonAbrirModalNuevoTutor) {
  elementoBotonAbrirModalNuevoTutor.addEventListener('click', abrirModalNuevoTutor);
}

if (elementoBotonCerrarModalEncabezado) {
  elementoBotonCerrarModalEncabezado.addEventListener('click', cerrarModalNuevoTutor);
}

if (elementoBotonCancelarModalTutor) {
  elementoBotonCancelarModalTutor.addEventListener('click', cerrarModalNuevoTutor);
}

elementoCampoSubidaFotoTutor.addEventListener('change', (evento) => {
  const archivoSeleccionado = evento.target.files[0];
  if (archivoSeleccionado) {
    const lectorDeArchivos = new FileReader();
    lectorDeArchivos.onload = (eventoLectura) => {
      cadenaFotoPerfilEnBase64 = eventoLectura.target.result;
      elementoVistaPreviaFotoTutor.style.backgroundImage = `url('${cadenaFotoPerfilEnBase64}')`;
      elementoVistaPreviaFotoTutor.innerHTML = '';
    };
    lectorDeArchivos.readAsDataURL(archivoSeleccionado);
  }
});

elementoBotonAgregarNuevoHorario.addEventListener('click', () => {
  const nuevaFilaHorario = document.createElement('div');
  nuevaFilaHorario.className = 'fila-horario-atencion-tutor';
  nuevaFilaHorario.innerHTML = `
    <select class="seleccion-dia-semana-horario menu-desplegable-formulario">
      <option value="Lunes">Lunes</option>
      <option value="Martes">Martes</option>
      <option value="Miércoles">Miércoles</option>
      <option value="Jueves">Jueves</option>
      <option value="Viernes">Viernes</option>
      <option value="Sábado">Sábado</option>
      <option value="Domingo">Domingo</option>
    </select>
    <input type="time" class="entrada-hora-inicio-horario entrada-texto-formulario" value="14:00">
    <button type="button" class="boton-eliminar-fila-horario" title="Eliminar horario">&times;</button>
  `;
  elementoContenedorListaHorarios.appendChild(nuevaFilaHorario);
});

elementoContenedorListaHorarios.addEventListener('click', (evento) => {
  if (evento.target.classList.contains('boton-eliminar-fila-horario')) {
    const cantidadFilasHorario = elementoContenedorListaHorarios.querySelectorAll('.fila-horario-atencion-tutor').length;
    if (cantidadFilasHorario > 1) {
      evento.target.closest('.fila-horario-atencion-tutor').remove();
    } else {
      alert('Debe haber al menos un horario de atención registrado.');
    }
  }
});

function obtenerListaTutoresDeLocalStorage() {
  const datosCadenaGuardados = localStorage.getItem(CLAVE_LOCAL_STORAGE_TUTORES);
  return datosCadenaGuardados ? JSON.parse(datosCadenaGuardados) : [];
}

function guardarListaTutoresEnLocalStorage(listaTutores) {
  localStorage.setItem(CLAVE_LOCAL_STORAGE_TUTORES, JSON.stringify(listaTutores));
}

window.prepararEdicionTutor = function(tutorId) {
  const listaTutores = obtenerListaTutoresDeLocalStorage();
  const tutor = listaTutores.find(t => String(t.id) === String(tutorId));

  if (!tutor) return;

  idTutorEnEdicion = tutor.id;

  const tituloModal = elementoModalSuperposicion.querySelector('.modal-titulo-nuevo-tutor');
  if (tituloModal) tituloModal.textContent = "Editar tutor";

  document.getElementById('campo-entrada-nombre-tutor').value = tutor.nombre || '';
  document.getElementById('campo-seleccion-materia-tutor').value = tutor.materia || '';
  document.getElementById('campo-seleccion-nivel-tutor').value = tutor.nivel || '';
  document.getElementById('campo-entrada-precio-tutor').value = tutor.precio || '';
  document.getElementById('campo-entrada-experiencia-tutor').value = tutor.experiencia || '';
  document.getElementById('campo-seleccion-modalidad-tutor').value = tutor.modalidad || '';
  document.getElementById('campo-entrada-idiomas-tutor').value = tutor.idiomas ? tutor.idiomas.join(', ') : '';
  document.getElementById('campo-entrada-habilidades-tutor').value = tutor.habilidades ? tutor.habilidades.join(', ') : '';
  document.getElementById('campo-textarea-descripcion-tutor').value = tutor.descripcion || '';

  if (tutor.foto) {
    cadenaFotoPerfilEnBase64 = tutor.foto;
    elementoVistaPreviaFotoTutor.style.backgroundImage = `url('${tutor.foto}')`;
    elementoVistaPreviaFotoTutor.innerHTML = '';
  }

  abrirModalNuevoTutor();
};

window.eliminarTutor = function(tutorId) {
  if (confirm("¿Estás seguro de que deseas eliminar este tutor?")) {
    let listaTutores = obtenerListaTutoresDeLocalStorage();
    listaTutores = listaTutores.filter(t => String(t.id) !== String(tutorId));
    guardarListaTutoresEnLocalStorage(listaTutores);
    mostrarTutores();
    window.dispatchEvent(new CustomEvent("tutorias:cambio"));
  }
};

elementoFormularioRegistroTutor.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const identificadorUnicoTutor = idTutorEnEdicion ? idTutorEnEdicion : `tutor-${Date.now()}`;
  const valorNombreCompleto = document.getElementById('campo-entrada-nombre-tutor').value.trim();
  const valorMateriaEnsenar = document.getElementById('campo-seleccion-materia-tutor').value;
  const valorNivelConocimiento = document.getElementById('campo-seleccion-nivel-tutor').value;
  const valorPrecioPorClase = parseFloat(document.getElementById('campo-entrada-precio-tutor').value) || 0;
  const valorAnosExperiencia = parseInt(document.getElementById('campo-entrada-experiencia-tutor').value) || 0;
  const valorModalidadClase = document.getElementById('campo-seleccion-modalidad-tutor').value;

  const valorRutaImagenFoto = cadenaFotoPerfilEnBase64 || `https://ui-avatars.com/api/?name=${encodeURIComponent(valorNombreCompleto)}&background=random`;

  const textoIdiomasInput = document.getElementById('campo-entrada-idiomas-tutor').value;
  const arregloIdiomas = textoIdiomasInput ? textoIdiomasInput.split(',').map(idioma => idioma.trim()).filter(Boolean) : ["Español"];

  const textoHabilidadesInput = document.getElementById('campo-entrada-habilidades-tutor').value;
  const arregloHabilidades = textoHabilidadesInput ? textoHabilidadesInput.split(',').map(habilidad => habilidad.trim()).filter(Boolean) : [];

  const textoDescripcionInput = document.getElementById('campo-textarea-descripcion-tutor').value.trim();
  const valorDescripcionFinal = textoDescripcionInput !== '' ? textoDescripcionInput : `Tutor especializado en ${valorMateriaEnsenar}.`;

  const coleccionFilasHorarios = elementoContenedorListaHorarios.querySelectorAll('.fila-horario-atencion-tutor');
  const arregloObjetosHorarios = Array.from(coleccionFilasHorarios).map((filaElemento, indiceHorario) => {
    const diaSeleccionado = filaElemento.querySelector('.seleccion-dia-semana-horario').value;
    const horaSeleccionada = filaElemento.querySelector('.entrada-hora-inicio-horario').value;

    return {
      id: `${identificadorUnicoTutor}-horario-${indiceHorario + 1}`,
      dia: diaSeleccionado,
      hora: horaSeleccionada,
      cuposIniciales: 20,
      cuposDisponibles: 20,
      activo: true
    };
  });

  let listaActualTutores = obtenerListaTutoresDeLocalStorage();

  if (idTutorEnEdicion) {
    listaActualTutores = listaActualTutores.map(t => {
      if (String(t.id) === String(idTutorEnEdicion)) {
        return {
          ...t,
          nombre: valorNombreCompleto,
          materia: valorMateriaEnsenar,
          nivel: valorNivelConocimiento,
          precio: valorPrecioPorClase,
          experiencia: valorAnosExperiencia,
          modalidad: valorModalidadClase,
          foto: valorRutaImagenFoto,
          idiomas: arregloIdiomas,
          habilidades: arregloHabilidades,
          descripcion: valorDescripcionFinal,
          horarios: arregloObjetosHorarios
        };
      }
      return t;
    });
    alert(`¡Tutor ${valorNombreCompleto} actualizado correctamente!`);
  } else {
    const objetoNuevoTutorRegistrado = {
      id: identificadorUnicoTutor,
      nombre: valorNombreCompleto,
      materia: valorMateriaEnsenar,
      nivel: valorNivelConocimiento,
      precio: valorPrecioPorClase,
      experiencia: valorAnosExperiencia,
      modalidad: valorModalidadClase,
      foto: valorRutaImagenFoto,
      rating: 4.8,
      resenas: 0,
      idiomas: arregloIdiomas,
      habilidades: arregloHabilidades,
      descripcion: valorDescripcionFinal,
      horarios: arregloObjetosHorarios
    };

    listaActualTutores.push(objetoNuevoTutorRegistrado);
    alert(`¡Tutor ${objetoNuevoTutorRegistrado.nombre} registrado correctamente!`);
  }

  guardarListaTutoresEnLocalStorage(listaActualTutores);
  window.dispatchEvent(new CustomEvent("tutorias:cambio"));
  cerrarModalNuevoTutor();
});

function crearColumna() {
  const columna = document.createElement("div");
  columna.className = "columna";
  return columna;
}

function crearPaginacionAdminTutores(totalPaginas) {
  let contenedorPag = document.getElementById("paginacionAdminTutores");
  if (!contenedorPag) {
    contenedorPag = document.createElement("div");
    contenedorPag.id = "paginacionAdminTutores";
    contenedorPag.className = "paginacion";
    const contenedorTutores = document.getElementById("listaTutores");
    if (contenedorTutores && contenedorTutores.parentNode) {
      contenedorTutores.parentNode.appendChild(contenedorPag);
    }
  }

  contenedorPag.innerHTML = "";
  if (totalPaginas <= 1) return;

  const boton = (texto, pagina, { activo = false, deshabilitado = false } = {}) => {
    const b = document.createElement("button");
    b.textContent = texto;
    if (activo) b.classList.add("activo");
    b.disabled = deshabilitado;
    b.addEventListener("click", () => { 
      paginaActualAdminTutores = pagina; 
      mostrarTutores(); 
    });
    return b;
  };

  contenedorPag.appendChild(boton("‹", paginaActualAdminTutores - 1, { deshabilitado: paginaActualAdminTutores === 1 }));
  for (let i = 1; i <= totalPaginas; i++) {
    contenedorPag.appendChild(boton(i, i, { activo: i === paginaActualAdminTutores }));
  }
  contenedorPag.appendChild(boton("›", paginaActualAdminTutores + 1, { deshabilitado: paginaActualAdminTutores === totalPaginas }));
}

function mostrarTutores() {
  const contenedorTutores = document.getElementById("listaTutores");
  if (!contenedorTutores) return;

  const tutoresGuardados = obtenerListaTutoresDeLocalStorage();

  const contador = document.getElementById("contadorTutores");
  if (contador) contador.textContent = tutoresGuardados.length;

  contenedorTutores.replaceChildren();

  if (tutoresGuardados.length === 0) {
    contenedorTutores.innerHTML = `<p class="sin-tutores">No hay tutores registrados.</p>`;
    const pag = document.getElementById("paginacionAdminTutores");
    if (pag) pag.innerHTML = "";
    return;
  }

  const totalPaginas = Math.ceil(tutoresGuardados.length / POR_PAGINA_ADMIN);
  if (paginaActualAdminTutores > totalPaginas) {
    paginaActualAdminTutores = 1;
  }

  const inicio = (paginaActualAdminTutores - 1) * POR_PAGINA_ADMIN;
  const paginados = tutoresGuardados.slice(inicio, inicio + POR_PAGINA_ADMIN);

  paginados.forEach((tutor) => {
    const fila = document.createElement("div");
    fila.className = "fila-tabla fila-tutor";

    const columnaNombre = crearColumna();
    const contenedorNombre = document.createElement("div");
    contenedorNombre.className = "tutor-celda-nombre";

    const foto = document.createElement("img");
    foto.className = "tutor-foto";
    foto.src = tutor.foto;
    foto.alt = `Foto de ${tutor.nombre}`;

    const nombre = document.createElement("span");
    nombre.className = "tutor-nombre";
    nombre.textContent = tutor.nombre;

    contenedorNombre.append(foto, nombre);
    columnaNombre.appendChild(contenedorNombre);

    const columnaCategoria = crearColumna();
    const badgeMateria = document.createElement("span");
    badgeMateria.className = "badge-materia";
    badgeMateria.textContent = tutor.materia;
    columnaCategoria.appendChild(badgeMateria);

    const columnaExperiencia = crearColumna();
    const anos = Number(tutor.experiencia) || 0;
    columnaExperiencia.textContent = `${anos} ${anos === 1 ? "año" : "años"}`;

    const columnaModalidad = crearColumna();
    columnaModalidad.textContent = tutor.modalidad;

    const columnaAcciones = crearColumna();
    const acciones = document.createElement("div");
    acciones.className = "tutoria-acciones";

    const btnVer = document.createElement("button");
    btnVer.type = "button";
    btnVer.className = "btn-accion btn-ver";
    btnVer.setAttribute("aria-label", `Ver a ${tutor.nombre}`);
    btnVer.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    btnVer.addEventListener("click", () => {
      window.location.href = `/pages/buscar-tutor/index.html?tutorId=${encodeURIComponent(tutor.id)}`;
    });

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.className = "btn-accion btn-editar";
    btnEditar.setAttribute("aria-label", `Editar a ${tutor.nombre}`);
    btnEditar.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
    btnEditar.addEventListener("click", () => prepararEdicionTutor(tutor.id));

    const btnEliminar = document.createElement("button");
    btnEliminar.type = "button";
    btnEliminar.className = "btn-accion btn-eliminar";
    btnEliminar.setAttribute("aria-label", `Eliminar a ${tutor.nombre}`);
    btnEliminar.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
    btnEliminar.addEventListener("click", () => eliminarTutor(tutor.id));

    acciones.append(btnVer, btnEditar, btnEliminar);
    columnaAcciones.appendChild(acciones);

    fila.append(columnaNombre, columnaCategoria, columnaExperiencia, columnaModalidad, columnaAcciones);
    contenedorTutores.appendChild(fila);
  });

  crearPaginacionAdminTutores(totalPaginas);
}

document.addEventListener("DOMContentLoaded", mostrarTutores);
window.addEventListener("tutorias:cambio", mostrarTutores);
window.addEventListener("storage", (e) => {
  if (e.key === "skillup_tutores") mostrarTutores();
});