// crea constantes para detectar si estamos dentro de una subpagina
const isNestedPage = window.location.pathname.includes('/pages/'); //devuelve la  ruta de la pag que esta abierta, sin incluir el dominio o parametros de busqueda 
// el metodo .incluides('/pages/') comprueba si la ruta contiene el texto /pages/
const ROOT = isNestedPage ? '../../' : './'; // si lo contiene isNestedPage sera true, sino false
// se usa el operador ternario condicion ? si estrue sube dos niveles de carpeta : si es false utiliza la carpeta actual
/*¿Por qué es importante? Porque el mismo archivo JavaScript puede funcionar tanto en la página principal como en las 
páginas internas, sin tener que escribir manualmente rutas diferentes para cada una.*/

/*aqui se crea un objeto, su funcion es relacionar el nombre logico de cada pagina
con la ubicacion de su archivo html
ej:
routes.nosotros devueve pages/nosotros/index.html
routes['buscar-tutor'] devuelve pages/buscar-tutor/index.html */
const routes = {
    home: 'index.html',
    nosotros: 'pages/nosotros/index.html',
    contactanos: 'pages/contactanos/index.html',
    'buscar-tutor': 'pages/buscar-tutor/index.html',
    biblioteca: 'pages/biblioteca/index.html',
    'iniciar-sesion': 'pages/iniciar-sesion/index.html',
    'agendar-tutoria': 'pages/agendar-tutoria/index.html',
    registro: 'pages/registro/index.html',
    'dashboard-admin': 'pages/dashboard-admin/index.html'
};

/*
aqui creamos una funcion para cargar componentes HTML
esta funcion es importante para la arquitectura modular, reutiliza archivos HTML, como navbar y footer,
para no copiarlos en todas las paginas
*/
async function include(selector, path) { /* declara la funcion, selector indica donde insertara el contenido, path indica de que
    archivo html obtendra el archivo*/
    const el = document.querySelector(selector); // busca el contenedor
    if (!el) return; // comprueba si existe, si el elemento no existe la funcion termina
    try {
        const response = await fetch(ROOT + path); /*manejo de errores, fetch() solicita el archivo al servidor
        await espera a que se complete la solicitud antes de continuar*/
        if (!response.ok) {
            throw new Error(`${response.status} ${path}`);
         } /* comprueba la respuesta http
    response.ok indica si la respuesta http fue exitosa
    */
        el.innerHTML = await response.text();
    } /*inserta el contenido HTML
    innerHTML, inserta ese HTML dentro del contenedor
    await espera a que termine la conversion
    response.text(), convierte la respuesta en texto*/
    catch (e) {
        console.error('No se pudo cargar el componente:', e); /*captura error, se muestra en la consola del navegador*/
    }
}

/*carga los componentes compartidos 
se usa Promise.all() para cargar varios componentes de manera concurrente
Promise.all(), permite esperar a que terminen las operaciones antes de continuar con la siguiente.
cada llamado recibe dos argumentos: el selector del contenedor y la ruta del archivo que debe cargar.
*/
await Promise.all([
    include('#site-header', 'components/header.html'),
    include('#site-footer', 'components/footer.html'),
    include('#home-valores', 'components/valores.html'),
    include('#banner-contacto', 'pages/contactanos/banner/banner.html'),
    include('#seccion-preguntas', 'pages/contactanos/preguntas/preguntas.html'),
    include('#formulario-correo', 'pages/contactanos/formulario-correo/formulario-correo.html')
]);
/*aqui asignamos los enlaces de navegacion
busca todos los elementos html que tengan el atributo data-route y les 
asigna su destino */
document.querySelectorAll('[data-route]').forEach(link => { /*selecciona los elementos con el atributo y .forEach
    recorre cada elemento encontrado, en cada iteracion link representa uno de esos enlaces*/
    const route = link.dataset.route; /* lee el valor de data-route
    si el elemento  tiene <a data-route="nosotros">Nosotros</a> entonces route sera nosotros*/
    if (routes[route]) { // comprueba que el nombre de a ruta existe en objeto routes
        link.href = ROOT + routes[route] // asigna la direccion de destino al enlace ej con nosotros: ./pages/nosotros/index.html
    }
});

// Resalta en el navbar el enlace de la página actual
const normalizar = ruta => ruta.replace(/index\.html$/, '').replace(/\/+$/, '');
const paginaActual = normalizar(location.pathname);

document.querySelectorAll('#site-header [data-route]').forEach(link => {
    const esActual = normalizar(link.pathname) === paginaActual;
    link.classList.toggle('activo', esActual);
    if (esActual) link.setAttribute('aria-current', 'page');
});


// Navbar: se oculta al bajar y reaparece con hover arriba, al subir o con Tab
const nav = document.querySelector('#site-header .navbar-skillup');
if (nav) {
    let ultimoScroll = window.scrollY;

    const mostrar = () => {
        nav.classList.remove('nav-oculto');
        document.body.classList.remove('nav-escondido');
    };
    const ocultar = () => {
        nav.classList.add('nav-oculto');
        document.body.classList.add('nav-escondido');
    };

    const zona = document.createElement('div');
    zona.className = 'nav-zona-hover';
    document.body.appendChild(zona);
    zona.addEventListener('mouseenter', mostrar);

    window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (Math.abs(y - ultimoScroll) < 8) return;
    if (y > ultimoScroll && y > 120) ocultar();
    else if (y < ultimoScroll) mostrar();
    ultimoScroll = y;
}, { passive: true });

    nav.addEventListener('mouseleave', () => {
        if (window.scrollY > 120) ocultar();
    });
    nav.addEventListener('focusin', mostrar);
}
/*aqui corregimos las rutas de las imagenes
ej en lugar de
<img data-asset="assets/images/logo.png" alt="Logo SkillUp">
colocamos 
img.dataset.asset y obtiene assets/images/logo.png
despues asiga la ruta completa: 
img.src = ROOT + img.dataset.asset; */
document.querySelectorAll('[data-asset]').forEach(img => {
    img.src = ROOT + img.dataset.asset;
});

// formulario de busqueda de tutores, busca el formulario con el atributo data-search-form
const searchForm = document.querySelector('[data-search-form]');
// si el form existe, se registra un evento q se ejecutara cuando se envie submit
if (searchForm) searchForm.addEventListener('submit', e => {
    e.preventDefault(); // evita el comportamiento predeterminado del form. recargar o navegar a otra pagina segun sus atribtos
    const q = new FormData(searchForm).get('q')?.toString().trim();/*
    new FormData(searchForm), obtiene los datos del formulario
    .get('q'), lee el valor del campo cuyo atributo name es q 
    ?.toString() convierte el valor a texto si no es null ni undefine
    .trim() elimina los espacios al principio y al final.*/
    location.href = ROOT + routes['buscar-tutor'] + (q ? '?q=' + encodeURIComponent(q) : ''); // navega a la pagina de búsqueda de tutores
}
);
/*
aqui se define una función flecha llamada feedback.
Recibe dos argumentos: form: el formulario donde se mostrará el mensaje. message: el texto que se desea mostrar.
Busca dentro del formulario un elemento con la clase form-feedback.
cuando se llama el texto aparece dentro del párrafo.
Se utiliza textContent en lugar de innerHTML porque aquí solo necesitas insertar texto, no interpretar etiquetas HTML.*/
const feedback = (form, message) => {
    const target = form.querySelector('.form-feedback');
    if (target) target.textContent = message;
};
/*Gestionar tres formularios con un solo ciclo 
Este ciclo recorre tres identificadores:
- contact-form: formulario de contacto.
- booking-form: formulario para agendar una tutoría.
- login-form: formulario de inicio de sesión.
document.getElementById(id) busca el formulario correspondiente.*/
for (const id of [
    'contact-form', 
    'booking-form', 
    'login-form'
]) {
    const form = document.getElementById(id);

    if (form) form.addEventListener('submit', e => {
        e.preventDefault(); // Si el formulario existe, registra un evento de envío y evita que la página se recargue.
        const message = id === 'contact-form' 
        ? 'Formulario validado. Para enviar el mensaje, falta conectar un servicio backend.' 
        : id === 'booking-form' 
        ? 'Solicitud validada. La reserva real requiere conexión con el backend y disponibilidad de tutores.' 
        : 'Formulario validado. La autenticación requiere conectar el proveedor de usuarios.'; 
        /*Este código utiliza operadores ternarios encadenados.
La lógica es:
1. Si el formulario es contact-form, muestra el mensaje de contacto.
2. Si no, pero es booking-form, muestra el mensaje de reserva.
3. En cualquier otro caso, muestra el mensaje de autenticación. */
        feedback(form, message); // Muestra el mensaje en el formulario correspondiente.
    });
}
// Recuperar la búsqueda cuando se abre la página de tutores
const tutorForm = document.getElementById('tutor-search'); // Busca el formulario específico para buscar tutores.
if (tutorForm) { // Comprueba que el formulario exista. Esto evita errores en páginas que no contienen ese formulario.
    const params = new URLSearchParams(location.search); // Lee los parámetros que aparecen después del signo ? en la URL.
    const input = document.getElementById('materia');// Busca el campo de entrada donde el usuario escribe la materia que quiere aprender.
    if (params.get('q')) input.value = params.get('q'); // Si la URL contiene un parámetro q, lo coloca dentro del campo de búsqueda.
    tutorForm.addEventListener('submit', e => {
        e.preventDefault();
        document.getElementById('tutor-results').textContent = 'Búsqueda preparada para: ' + (input.value.trim() ||
            'todas las materias') + '. El listado de tutores se mostrará al conectar el catálogo de tutores.';
    });
}
/*
const date = document.getElementById('booking-date'); if (date) date.min = new Date().toISOString().split('T')[0];
const registerForm = document.getElementById('register-form');
if (registerForm) registerForm.addEventListener('submit', event => {
    event.preventDefault(); const password = document.getElementById('password-registro');
    const confirm = document.getElementById('confirmar-password');
    const target = registerForm.querySelector('.form-feedback');
    if (password.value !== confirm.value) {
        target.textContent = 'Las contraseñas no coinciden.';
        confirm.focus(); return;
    } target.textContent = 'Formulario validado. Para crear la cuenta, falta conectar el servicio de autenticación.';
});
const exportButton = document.getElementById('admin-export');
if (exportButton) exportButton.addEventListener('click', () => {
    const feedback = document.getElementById('admin-feedback');
    if (feedback) feedback.textContent = 'La exportación estará disponible cuando el dashboard esté conectado a datos reales.';
});*/

