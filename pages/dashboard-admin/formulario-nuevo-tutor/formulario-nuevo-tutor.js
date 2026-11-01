document.addEventListener('DOMContentLoaded', () => {
  /*const CLAVE_LOCAL_STORAGE_TUTORES = 'lista_tutores';*/
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

  let cadenaFotoPerfilEnBase64 = null;

  function abrirModalNuevoTutor() {
    elementoModalSuperposicion.classList.remove('modal-oculto');
  }

  function cerrarModalNuevoTutor() {
    elementoModalSuperposicion.classList.add('modal-oculto');
    elementoFormularioRegistroTutor.reset();
    cadenaFotoPerfilEnBase64 = null;
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

  elementoFormularioRegistroTutor.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const identificadorUnicoTutor = `tutor-${Date.now()}`;
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

    /*const listaActualTutores = obtenerListaTutoresDeLocalStorage();
    listaActualTutores.push(objetoNuevoTutorRegistrado);
    guardarListaTutoresEnLocalStorage(listaActualTutores);
    alert(`¡Tutor ${objetoNuevoTutorRegistrado.nombre} registrado correctamente en LocalStorage!`);*/

    // Recupera los tutores que ya están guardados.
    const listaActualTutores = obtenerListaTutoresDeLocalStorage();

    // Evita agregar dos veces el mismo tutor.
    listaActualTutores.push(objetoNuevoTutorRegistrado);

    // Guarda el catálogo actualizado.
    guardarListaTutoresEnLocalStorage(listaActualTutores);

    // Recupera las tutorías y sus cupos existentes.
    const tutorias = JSON.parse(localStorage.getItem("tutorias") || "[]");

    // Calcula el siguiente identificador de tutoría.
    let siguienteId = tutorias.reduce(
      (max, t) => Math.max(max, Number(t.id) || 0), 0
    ) + 1;

    // Crea una tutoría por cada horario del nuevo tutor.
    objetoNuevoTutorRegistrado.horarios.forEach(horario => {
      tutorias.push({
        id: siguienteId++,
        tutor: objetoNuevoTutorRegistrado.nombre,
        materia: objetoNuevoTutorRegistrado.materia,
        titulo: `${objetoNuevoTutorRegistrado.materia} - ${horario.dia} ${horario.hora}`,
        nivel: objetoNuevoTutorRegistrado.nivel,
        precio: objetoNuevoTutorRegistrado.precio,
        modalidad: objetoNuevoTutorRegistrado.modalidad,
        fecha: horario.dia,
        hora: horario.hora,
        cupos: horario.cuposDisponibles
      });
    });

    // Guarda las nuevas tutorías sin borrar las anteriores.
    localStorage.setItem("tutorias", JSON.stringify(tutorias));

    // Notifica a los componentes de la página actual.
    window.dispatchEvent(new CustomEvent("tutorias:cambio"));

    // Informa que el registro terminó.
    alert(`¡Tutor ${objetoNuevoTutorRegistrado.nombre} registrado correctamente!`);

    // Cierra el formulario.
    cerrarModalNuevoTutor();

  });
});
