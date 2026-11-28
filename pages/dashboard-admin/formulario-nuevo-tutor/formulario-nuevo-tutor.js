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

// sincronizacion con back end
let cacheMateriasBackend = [];

async function cargarMateriasEnSelect() {
  const selectMateria = document.getElementById(
    'campo-seleccion-materia-tutor'
  );

  if (!selectMateria) return;

  // Limpiar las opciones antiguas del HTML
  selectMateria.innerHTML = `
        <option value="">Cargando materias...</option>
    `;

  try {
    const materias = await apiRequest('/materias');

    if (!Array.isArray(materias) || materias.length === 0) {
      throw new Error('No hay materias registradas en MySQL.');
    }

    cacheMateriasBackend = materias;

    selectMateria.innerHTML = `
            <option value="">Selecciona una materia</option>
        `;

    materias.forEach(materia => {
      const opcion = document.createElement('option');

      opcion.value = materia.nombre;
      opcion.dataset.id = materia.id;
      opcion.textContent = materia.nombre;

      selectMateria.appendChild(opcion);
    });

  } catch (error) {
    console.error('Error cargando materias:', error);

    cacheMateriasBackend = [];

    selectMateria.innerHTML = `
            <option value="">No se pudieron cargar las materias</option>
        `;
  }
}
// Conexion base de datos y crear materia
// Permite crear una materia nueva directamente desde el selector del modal
(function habilitarCreacionMateria() {
  const selectMateria = document.getElementById('campo-seleccion-materia-tutor');
  if (!selectMateria) return;

  // Envolvemos cargarMateriasEnSelect para añadir siempre la opción de crear al final
  const cargarOriginal = cargarMateriasEnSelect;
  cargarMateriasEnSelect = async function () {
    await cargarOriginal();
    const optNueva = document.createElement('option');
    optNueva.value = '__NUEVA_MATERIA__';
    optNueva.textContent = '+ Crear nueva materia...';
    selectMateria.appendChild(optNueva);
  };

  selectMateria.addEventListener('change', async function () {
    if (selectMateria.value !== '__NUEVA_MATERIA__') return;

    const nombreNueva = await pedirDatoAviso('Nueva materia', 'Escribe el nombre de la nueva materia', 'Crear');
    if (!nombreNueva || !nombreNueva.trim()) {
      selectMateria.value = '';
      return;
    }

    try {
      const creada = await apiRequest('/materias', {
        method: 'POST',
        body: JSON.stringify({
          nombre: nombreNueva.trim(),
          descripcion: `Tutorías de ${nombreNueva.trim()}`
        })
      });

      await cargarMateriasEnSelect();
      selectMateria.value = creada.nombre;
    } catch (error) {
      alert(error.message || 'No se pudo crear la materia.');
      selectMateria.value = '';
    }
  });
})();

//---------------------------------------------

async function sincronizarTutoresConBackend() {
  try {
    const pagina = await apiRequest('/tutores?size=100');
    const listaJava = pagina && Array.isArray(pagina.content) ? pagina.content : [];
    const locales = obtenerListaTutoresDeLocalStorage();

    // Adaptamos los tutores de MySQL conservando extras visuales (horarios/idiomas) si existían
    const sincronizados = listaJava.map((t) => {
      const previo = locales.find((l) => String(l.id) === String(t.id)) || {};
      const nombreCompleto = t.usuario ? `${t.usuario.nombre} ${t.usuario.apellido}` : 'Tutor';
      return {
        id: t.id,
        usuarioId: t.usuario ? t.usuario.id : null,
        nombre: nombreCompleto,
        materia: t.materia ? t.materia.nombre : '',
        nivel: t.nivel || 'Intermedio',
        precio: t.precio || 0,
        experiencia: parseInt(t.experiencia) || 0,
        modalidad: t.modalidad || 'Virtual',
        foto: t.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto)}&background=random`,
        rating: previo.rating || 4.8,
        resenas: previo.resenas || 0,
        idiomas: previo.idiomas || ['Español'],
        habilidades: previo.habilidades || [],
        descripcion: previo.descripcion || `Tutor especializado en ${t.materia ? t.materia.nombre : ''}.`,
        horarios: previo.horarios || []
      };
    });

    guardarListaTutoresEnLocalStorage(sincronizados);
    mostrarTutores();
    window.dispatchEvent(new CustomEvent('tutorias:cambio'));
  } catch (error) {
    console.error('Error sincronizando tutores con MySQL:', error);
  }
}

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

elementoCampoSubidaFotoTutor.addEventListener('change', async (evento) => {
  const archivoSeleccionado = evento.target.files[0];
  if (!archivoSeleccionado) return;
  try {
    cadenaFotoPerfilEnBase64 = await archivoADataUrl(archivoSeleccionado);
    elementoVistaPreviaFotoTutor.style.backgroundImage = `url('${cadenaFotoPerfilEnBase64}')`;
    elementoVistaPreviaFotoTutor.innerHTML = '';
  } catch (error) {
    evento.target.value = '';
    mostrarAviso(error.message, 'error');
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

window.prepararEdicionTutor = function (tutorId) {
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

/*
window.eliminarTutor = function(tutorId) {
  if (confirm("¿Estás seguro de que deseas eliminar este tutor?")) {
    let listaTutores = obtenerListaTutoresDeLocalStorage();
    listaTutores = listaTutores.filter(t => String(t.id) !== String(tutorId));
    guardarListaTutoresEnLocalStorage(listaTutores);
    mostrarTutores();
    window.dispatchEvent(new CustomEvent("tutorias:cambio"));
  }
};

*/

window.eliminarTutor = async function (tutorId) {
  if (!confirm("¿Estás seguro de que deseas eliminar este tutor?")) return;

  try {
    await apiRequest(`/tutores/${tutorId}`, { method: 'DELETE' });
    await sincronizarTutoresConBackend();
  } catch (error) {
    alert(error.message || "Error al eliminar el tutor en el servidor.");
  }
};

elementoFormularioRegistroTutor.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const identificadorUnicoTutor = idTutorEnEdicion ? idTutorEnEdicion : `tutor-${Date.now()}`;
  const valorNombreCompleto = document.getElementById('campo-entrada-nombre-tutor').value.trim();
  const valorMateriaEnsenar = document.getElementById('campo-seleccion-materia-tutor').value;
  const valorNivelConocimiento = document.getElementById('campo-seleccion-nivel-tutor').value;
  const valorPrecioPorClase = parseFloat(document.getElementById('campo-entrada-precio-tutor').value) || 0;
  const valorAnosExperiencia = parseInt(document.getElementById('campo-entrada-experiencia-tutor').value) || 0;
  const valorModalidadClase = document.getElementById('campo-seleccion-modalidad-tutor').value;

  const valorRutaImagenFoto = cadenaFotoPerfilEnBase64 || null;

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
    mostrarAviso(`Tutor ${valorNombreCompleto} actualizado con éxito.`);
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
    mostrarAviso(`Tutor ${objetoNuevoTutorRegistrado.nombre} añadido con éxito.`);
  }
  // nuevo

  const materiaObj = cacheMateriasBackend.find(
    (m) => m.nombre.toLowerCase() === valorMateriaEnsenar.toLowerCase()
  );

  if (!materiaObj) {
    alert("La materia seleccionada no existe en la base de datos.");
    return;
  }

  const partesNombre = valorNombreCompleto.split(/\s+/);
  const nombre = partesNombre[0];
  const apellido = partesNombre.slice(1).join(" ") || "Tutor";
  const fotoParaBD = valorRutaImagenFoto;

  try {
    if (idTutorEnEdicion) {
      const tutorActual = listaActualTutores.find((t) => String(t.id) === String(idTutorEnEdicion));
      if (tutorActual && tutorActual.usuarioId) {
        await apiRequest(`/usuarios/${tutorActual.usuarioId}`, {
          method: 'PUT',
          body: JSON.stringify({ nombre, apellido, telefono: "", foto: fotoParaBD })
        });
      }
      await apiRequest(`/tutores/${idTutorEnEdicion}`, {
        method: 'PUT',
        body: JSON.stringify({
          usuario: { id: tutorActual.usuarioId },
          materia: { id: materiaObj.id },
          nivel: valorNivelConocimiento,
          precio: valorPrecioPorClase,
          experiencia: `${valorAnosExperiencia} años`,
          modalidad: valorModalidadClase,
          foto: fotoParaBD
        })
      });
    } else {
      const slug = valorNombreCompleto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '.');
      const usuarioCreado = await apiRequest('/auth/registro', {
        method: 'POST',
        body: JSON.stringify({
          nombre,
          apellido,
          email: `${slug}.${Date.now()}@skillup.com`,
          contrasena: 'TutorSkillUp123!',
          tipoUsuario: 'ADMIN_TUTOR',
          telefono: "",
          foto: fotoParaBD
        })
      });

      const tutorCreado = await apiRequest('/tutores', {
        method: 'POST',
        body: JSON.stringify({
          usuario: { id: usuarioCreado.id },
          materia: { id: materiaObj.id },
          nivel: valorNivelConocimiento,
          precio: valorPrecioPorClase,
          experiencia: `${valorAnosExperiencia} años`,
          modalidad: valorModalidadClase,
          foto: fotoParaBD
        })
      });

      // Actualizamos el ID local con el ID real generado por MySQL
      listaActualTutores[listaActualTutores.length - 1].id = tutorCreado.id;
      listaActualTutores[listaActualTutores.length - 1].usuarioId = usuarioCreado.id;
    }
  } catch (error) {
    alert(error.message || "Error al guardar el tutor en MySQL.");
    return;
  }

  // hasta aquí 

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
      window.location.href = `../../pages/buscar-tutor/index.html?tutorId=${encodeURIComponent(tutor.id)}`;
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

/*
document.addEventListener("DOMContentLoaded", mostrarTutores);
window.addEventListener("tutorias:cambio", mostrarTutores);
window.addEventListener("storage", (e) => {
  if (e.key === "skillup_tutores") mostrarTutores();

  */
document.addEventListener("DOMContentLoaded", async () => {
  await cargarMateriasEnSelect();
  await sincronizarTutoresConBackend();
});

