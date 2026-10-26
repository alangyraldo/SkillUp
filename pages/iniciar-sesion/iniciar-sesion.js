/**
 * Maneja el evento de envío del formulario de inicio de sesión
 */
/* COMENTARIE TU CODIGO DIANA, PARA PODER TOCAR EL FORMULARIO Y EL INGRESO DE SESION 
function manejarSesion(evento) {
  evento.preventDefault();
  const correo = document.getElementById('correo-sesion').value;
  console.log(`Iniciando sesión con: ${correo}`);
  alert('¡Inicio de sesión exitoso!');
}
*/

// Solo en la pagina de login si ya hay sesion de admin ir al dashboard
if (document.getElementById('correo-sesion') && typeof esAdmin === 'function' && esAdmin()) {
  window.location.replace('/pages/dashboard-admin/index.html');
}
function manejarSesion(evento) {
  evento.preventDefault();

  const correo = document.getElementById('correo-sesion').value;
  const clave = document.getElementById('contrasena-sesion').value;
  const mensajeError = document.getElementById('mensaje-error');

  if (iniciarSesion(correo, clave)) {
    window.location.href = '/pages/dashboard-admin/index.html';
  } else {
    mensajeError.textContent = 'Correo o contraseña incorrectos.';
    document.getElementById('contrasena-sesion').value = '';
  }
}

/**
 * Controla la selección de rol en la página de registro (Aprender vs Enseñar)
 */
function seleccionarRol(rol, elementoBoton) {
  const botonesRol = document.querySelectorAll('.boton-rol');
  botonesRol.forEach(btn => btn.classList.remove('activo'));
  elementoBoton.classList.add('activo');
  console.log(`Rol seleccionado: ${rol}`);
}

/**
 * Maneja el evento de envío del formulario de creación de cuenta
 */
function manejarRegistro(evento) {
  evento.preventDefault();
  const nombre = document.getElementById('nombre-registro').value;
  const apellido = document.getElementById('apellido-registro').value;
  const correo = document.getElementById('correo-registro').value;
  
  console.log(`Registrando usuario: ${nombre} ${apellido} (${correo})`);
  alert('¡Cuenta creada correctamente! Bienvenido a SkillUp.');
  
  // Redirigir opcionalmente al inicio de sesión
  window.location.href = 'index.html';
}


/**
 * Evalúa la fortaleza de la contraseña y anima las barritas indicadoras
 * @param {string} password - Texto ingresado en el input de contraseña
 */
function verificarFortaleza(password) {
  const barra1 = document.getElementById('barra-1');
  const barra2 = document.getElementById('barra-2');
  const barra3 = document.getElementById('barra-3');
  const barra4 = document.getElementById('barra-4');
  const textoAyuda = document.getElementById('texto-ayuda-password');

  // Reiniciar todas las barras
  const barras = [barra1, barra2, barra3, barra4];
  barras.forEach(barra => barra.classList.remove('activa'));

  if (password.length === 0) {
    textoAyuda.textContent = "Mínimo 8 caracteres con letras y números";
    return;
  }

  let nivelFuerza = 0;

  // Condición 1: Al menos 8 caracteres
  if (password.length >= 8) nivelFuerza++;
  
  // Condición 2: Contiene letras mayúsculas y minúsculas
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) nivelFuerza++;
  
  // Condición 3: Contiene números
  if (/\d/.test(password)) nivelFuerza++;
  
  // Condición 4: Contiene caracteres especiales
  if (/[^A-Za-z0-9]/.test(password)) nivelFuerza++;

  // Si la contraseña es menor a 8 caracteres, forzamos un máximo de 1 barra activa
  if (password.length < 8) {
    nivelFuerza = Math.min(nivelFuerza, 1);
  }

  // Activar las barras correspondientes de izquierda a derecha
  for (let i = 0; i < nivelFuerza; i++) {
    barras[i].classList.add('activa');
  }

  // Actualizar texto de ayuda según el nivel
  if (nivelFuerza <= 1) {
    textoAyuda.textContent = "Contraseña muy débil";
  } else if (nivelFuerza === 2 || nivelFuerza === 3) {
    textoAyuda.textContent = "Contraseña moderada";
  } else {
    textoAyuda.textContent = "¡Contraseña fuerte!";
  }
}

// --- LÓGICA DEL MODAL DE RECUPERACIÓN DE CONTRASEÑA ---
const enlaceOlvido = document.getElementById('btn-olvido');
const modalRecuperacion = document.getElementById('modal-recuperacion');
const botonCerrarModal = document.getElementById('cerrar-modal');
const formRecuperar = document.getElementById('form-recuperar');
const mensajeExito = document.getElementById('mensaje-exito');

// Abrir modal al hacer clic en "¿Olvidaste tu contraseña?"
if (enlaceOlvido) {
  enlaceOlvido.addEventListener('click', (e) => {
    e.preventDefault();
    modalRecuperacion.classList.add('activo');
  });
}

// Cerrar modal con la "X"
if (botonCerrarModal) {
  botonCerrarModal.addEventListener('click', () => {
    cerrarModal();
  });
}

// Cerrar modal haciendo clic fuera de la caja blanca
if (modalRecuperacion) {
  modalRecuperacion.addEventListener('click', (e) => {
    if (e.target === modalRecuperacion) {
      cerrarModal();
    }
  });
}

function cerrarModal() {
  modalRecuperacion.classList.remove('activo');
  // Opcional: limpiar formulario y mensaje después de cerrar
  setTimeout(() => {
    formRecuperar.reset();
    formRecuperar.style.display = 'block';
    mensajeExito.classList.add('oculto');
  }, 300);
}

// Recuperacion de contrasela
function enviarRecuperacion(event) {
  event.preventDefault();
  const correoInput = document.getElementById('correo-recuperar').value;

  
  console.log(`Enviando instrucciones de recuperación a: ${correoInput}`);

  // Ocultar el formulario y mostrar el mensaje de éxito 
  formRecuperar.style.display = 'none';
  mensajeExito.classList.remove('oculto');

  // Cerrar automáticamente el modal luego de 4 segundos
  setTimeout(() => {
    cerrarModal();
  }, 4000);
}