// Declara el arreglo que contiene los recursos de demostración.
const sampleResources = [
    // Abre el objeto del primer recurso.
    {
        // Define el identificador único del recurso.
        id: 1,
        // Define el título que verá el usuario.
        title: "Introducción a Java",
        // Define la categoría del recurso.
        category: "programacion",
        // Define el formato del contenido.
        type: "libro",
        // Indica quién recomienda el material.
        author: "Equipo SkillUp",
        // Describe la duración o formato del material.
        duration: "Guía de lectura",
        // Inicia la descripción del recurso.
        description:
            // Guarda el texto descriptivo.
            "Aprende los fundamentos de Java, variables, tipos de datos, condicionales, ciclos y programación orientada a objetos.",
        // Indica que se define la imagen de portada.
        image:
            // Guarda la URL de la portada.
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
        // Define el enlace al contenido externo.
        url: "https://dev.java/learn/"
    // Cierra el primer recurso.
    },
    // Abre el objeto del segundo recurso.
    {
        // Define el identificador único del recurso.
        id: 2,
        // Define el título del recurso.
        title: "Fundamentos de diseño UI/UX",
        // Clasifica el recurso en diseño.
        category: "diseno",
        // Define el formato del recurso.
        type: "video",
        // Indica quién recomienda el material.
        author: "Equipo SkillUp",
        // Describe el formato del contenido.
        duration: "Video educativo",
        // Inicia la descripción del recurso.
        description:
            // Guarda el texto descriptivo.
            "Descubre los principios de diseño de interfaces, jerarquía visual, usabilidad y experiencia de usuario.",
        // Indica que se define la imagen de portada.
        image:
            // Guarda la URL de la portada.
            "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=800&q=80",
        // Define el enlace para buscar videos del tema.
        url: "https://www.youtube.com/results?search_query=fundamentos+de+dise%C3%B1o+UI+UX"
    // Cierra el segundo recurso.
    },
    // Abre el objeto del tercer recurso.
    {
        // Define el identificador único del recurso.
        id: 3,
        // Define el título del recurso.
        title: "Inglés para principiantes",
        // Clasifica el recurso en idiomas.
        category: "idiomas",
        // Define el formato del recurso.
        type: "guia",
        // Indica quién recomienda el material.
        author: "Equipo SkillUp",
        // Describe el formato del contenido.
        duration: "Material de estudio",
        // Inicia la descripción del recurso.
        description:
            // Guarda el texto descriptivo.
            "Repasa vocabulario cotidiano, expresiones comunes y estructuras básicas para comenzar a comunicarte en inglés.",
        // Indica que se define la imagen de portada.
        image:
            // Guarda la URL de la portada.
            "https://images.unsplash.com/photo-1543109740-4bdb38fda756?auto=format&fit=crop&w=800&q=80",
        // Define el enlace al sitio de aprendizaje de inglés.
        url: "https://learnenglish.britishcouncil.org/"
    // Cierra el tercer recurso.
    },
    // Abre el objeto del cuarto recurso.
    {
        // Define el identificador único del recurso.
        id: 4,
        // Define el título del recurso.
        title: "Marketing digital desde cero",
        // Clasifica el recurso en marketing.
        category: "marketing",
        // Define el formato del recurso.
        type: "video",
        // Indica quién recomienda el material.
        author: "Equipo SkillUp",
        // Describe el formato del contenido.
        duration: "Video educativo",
        // Inicia la descripción del recurso.
        description:
            // Guarda el texto descriptivo.
            "Conoce los conceptos esenciales de marketing digital, audiencias, contenido, posicionamiento y redes sociales.",
        // Indica que se define la imagen de portada.
        image:
            // Guarda la URL de la portada.
            "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=800&q=80",
        // Define el enlace para buscar videos del tema.
        url: "https://www.youtube.com/results?search_query=curso+marketing+digital+principiantes"
    // Cierra el cuarto recurso.
    },
    // Abre el objeto del quinto recurso.
    {
        // Define el identificador único del recurso.
        id: 5,
        // Define el título del recurso.
        title: "Lógica de programación",
        // Clasifica el recurso en programación.
        category: "programacion",
        // Define el formato del recurso.
        type: "guia",
        // Indica quién recomienda el material.
        author: "Equipo SkillUp",
        // Describe el formato del contenido.
        duration: "Guía de estudio",
        // Inicia la descripción del recurso.
        description:
            // Guarda el texto descriptivo.
            "Fortalece tu pensamiento lógico con algoritmos, variables, decisiones, ciclos y ejercicios prácticos.",
        // Indica que se define la imagen de portada.
        image:
            // Guarda la URL de la portada.
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        // Define el enlace a la documentación de desarrollo web.
        url: "https://developer.mozilla.org/es/docs/Learn_web_development"
    // Cierra el quinto recurso.
    },
    // Abre el objeto del sexto recurso.
    {
        // Define el identificador único del recurso.
        id: 6,
        // Define el título del recurso.
        title: "Creatividad y comunicación visual",
        // Clasifica el recurso en diseño.
        category: "diseno",
        // Define el formato del recurso.
        type: "libro",
        // Indica quién recomienda el material.
        author: "Equipo SkillUp",
        // Describe el formato del contenido.
        duration: "Lectura recomendada",
        // Inicia la descripción del recurso.
        description:
            // Guarda el texto descriptivo.
            "Explora conceptos de composición, color, tipografía y comunicación visual para crear diseños más claros.",
        // Indica que se define la imagen de portada.
        image:
            // Guarda la URL de la portada.
            "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
        // Define el enlace a recursos de Canva.
        url: "https://www.canva.com/learn/"
    // Cierra el sexto recurso.
    },
    // Abre el objeto del séptimo recurso.
    {
        // Define el identificador único del recurso.
        id: 7,
        // Define el título del recurso.
        title: "Fundamentos de emprendimiento",
        // Clasifica el recurso en negocios.
        category: "negocios",
        // Define el formato del recurso.
        type: "libro",
        // Indica quién recomienda el material.
        author: "Equipo SkillUp",
        // Describe el formato del contenido.
        duration: "Lectura recomendada",
        // Inicia la descripción del recurso.
        description:
            // Guarda el texto descriptivo.
            "Aprende a identificar oportunidades, definir una propuesta de valor y organizar las ideas de un negocio.",
        // Indica que se define la imagen de portada.
        image:
            // Guarda la URL de la portada.
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
        // Define el enlace a una guía de emprendimiento.
        url: "https://www.sba.gov/business-guide"
    // Cierra el séptimo recurso.
    },
    // Abre el objeto del octavo recurso.
    {
        // Define el identificador único del recurso.
        id: 8,
        // Define el título del recurso.
        title: "Excel para principiantes",
        // Clasifica el recurso en negocios.
        category: "negocios",
        // Define el formato del recurso.
        type: "video",
        // Indica quién recomienda el material.
        author: "Equipo SkillUp",
        // Describe el formato del contenido.
        duration: "Video educativo",
        // Inicia la descripción del recurso.
        description:
            // Guarda el texto descriptivo.
            "Conoce las hojas de cálculo, fórmulas básicas, tablas y herramientas para organizar información.",
        // Indica que se define la imagen de portada.
        image:
            // Guarda la URL de la portada.
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        // Define el enlace para buscar videos de Excel.
        url: "https://www.youtube.com/results?search_query=excel+para+principiantes"
    // Cierra el octavo recurso.
    },
    // Abre el objeto del noveno recurso.
    {
        // Define el identificador único del recurso.
        id: 9,
        // Define el título del recurso.
        title: "Conversación en inglés",
        // Clasifica el recurso en idiomas.
        category: "idiomas",
        // Define el formato del recurso.
        type: "video",
        // Indica quién recomienda el material.
        author: "Equipo SkillUp",
        // Describe el formato del contenido.
        duration: "Video educativo",
        // Inicia la descripción del recurso.
        description:
            // Guarda el texto descriptivo.
            "Practica expresiones para presentarte, mantener conversaciones y desenvolverte en situaciones cotidianas.",
        // Indica que se define la imagen de portada.
        image:
            // Guarda la URL de la portada.
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
        // Define el enlace al sitio de aprendizaje de inglés.
        url: "https://learnenglish.britishcouncil.org/"
    // Cierra el noveno recurso.
    }
// Cierra el arreglo de recursos de demostración.
];

// Marca el comienzo de la configuración del estado de la página.
const FAVORITES_KEY = "skillup-biblioteca-favorites"; // Define la clave para guardar favoritos en el navegador.
// Copia los recursos de ejemplo en la lista que utilizará la página.
let resources = [...sampleResources];
// Indica que inicialmente se muestran todos los recursos.
let showingFavorites = false;

// Busca el campo de búsqueda en el HTML.
const searchInput = document.getElementById("resource-search");
// Busca el selector de categorías en el HTML.
const categoryFilter = document.getElementById("category-filter");
// Busca el selector de tipos de recurso en el HTML.
const typeFilter = document.getElementById("type-filter");
// Busca el contenedor donde aparecerán las tarjetas.
const resourcesGrid = document.getElementById("resources-grid");
// Busca el elemento que muestra la cantidad de resultados.
const resultsCount = document.getElementById("results-count");
// Busca el elemento que muestra el título de los resultados.
const resultsTitle = document.getElementById("results-title");
// Busca el contenedor que aparece cuando no hay resultados.
const emptyState = document.getElementById("empty-state");
// Busca el botón que limpia el campo de búsqueda.
const clearSearchButton = document.getElementById("clear-search");
// Busca el botón que activa o desactiva la vista de favoritos.
const favoritesToggle = document.getElementById("favorites-toggle");
// Busca el elemento que muestra el número de favoritos.
const favoritesCount = document.getElementById("favorites-count");

// Busca el elemento HTML que contiene la ventana modal.
const resourceModalElement = document.getElementById("resource-modal");
// Obtiene el modal de Bootstrap o crea una instancia si todavía no existe.
const resourceModal = resourceModalElement ? bootstrap.Modal.getOrCreateInstance(resourceModalElement) : null;
// Marca el comienzo de las funciones auxiliares.
function escapeHTML(value = "") {
    // Convierte el valor recibido en una cadena de texto y busca caracteres especiales.
    return String(value).replace(/[&<>"']/g, character => ({
        // Reemplaza el ampersand por su entidad HTML segura.
        "&": "&amp;",
        // Reemplaza el símbolo menor que por su entidad HTML segura.
        "<": "&lt;",
        // Reemplaza el símbolo mayor que por su entidad HTML segura.
        ">": "&gt;",
        // Reemplaza las comillas dobles por su entidad HTML segura.
        '"': "&quot;",
        // Reemplaza el apóstrofo por su entidad HTML segura.
        "'": "&#39;"
    // Busca la entidad HTML correspondiente al carácter encontrado.
    })[character]);
}

// Declara una función para recuperar los favoritos guardados.
function getFavorites() {
    // Inicia el bloque donde se pueden capturar errores.
    try {
        // Lee los favoritos del navegador y convierte el JSON en datos de JavaScript.
        const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
        // Devuelve los favoritos solo si el dato recuperado es un arreglo.
        return Array.isArray(stored) ? stored : [];
    // Captura cualquier error producido al leer o interpretar los favoritos.
    } catch {
        // Devuelve un arreglo vacío si no se pueden recuperar los favoritos.
        return [];
    // Finaliza el bloque de manejo de errores.
    }
}

// Declara una función para guardar los favoritos en el navegador.
function saveFavorites(favorites) {
    // Inicia el bloque donde se pueden capturar errores.
    try {
        // Guarda los favoritos convirtiéndolos primero a una cadena JSON.
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        // Informa que el guardado terminó correctamente.
        return true;
    // Captura el error que ocurra durante el guardado.
    } catch (error) {
        // Muestra el error en la consola para ayudar a encontrar la causa.
        console.error("No se pudieron guardar los favoritos:", error);
        // Informa al usuario que el navegador no pudo guardar el favorito.
        alert("No fue posible guardar el favorito en este navegador.");
        // Indica que el guardado falló.
        return false;
    // Finaliza el bloque de manejo de errores.
    }
}

// Declara una función que verifica si un recurso está guardado como favorito.
function isFavorite(id) {
    // Recupera los favoritos y comprueba si contienen el identificador numérico recibido.
    return getFavorites().includes(Number(id));
}

// Declara una función para traducir el código de una categoría a su nombre visible.
function getCategoryLabel(category) {
    // Crea un objeto que relaciona los códigos internos con sus etiquetas.
    const labels = {
        // Define la etiqueta visible para programación.
        programacion: "Programación",
        // Define la etiqueta visible para diseño.
        diseno: "Diseño",
        // Define la etiqueta visible para idiomas.
        idiomas: "Idiomas",
        // Define la etiqueta visible para marketing.
        marketing: "Marketing",
        // Define la etiqueta visible para negocios.
        negocios: "Negocios"
    // Cierra el objeto de etiquetas.
    };
    // Devuelve la etiqueta encontrada o "Otros" si no existe.
    return labels[category] || "Otros";
}

// Declara una función para traducir el código del tipo de recurso.
function getTypeLabel(type) {
    // Crea un objeto que relaciona cada tipo con su nombre visible.
    const labels = {
        // Define la etiqueta visible para los libros.
        libro: "Libro",
        // Define la etiqueta visible para los videos.
        video: "Video",
        // Define la etiqueta visible para las guías.
        guia: "Guía"
    // Cierra el objeto de etiquetas.
    };
    // Devuelve la etiqueta del tipo o "Recurso" si no se encuentra.
    return labels[type] || "Recurso";
}

// Declara una función que obtiene el icono correspondiente al tipo de recurso.
function getTypeIcon(type) {
    // Crea un objeto con las clases de iconos de Bootstrap Icons.
    const icons = {
        // Asigna el icono de libro al tipo libro.
        libro: "bi-book",
        // Asigna el icono de reproducción al tipo video.
        video: "bi-play-circle",
        // Asigna el icono de documento al tipo guía.
        guia: "bi-file-earmark-text"
    // Cierra el objeto de iconos.
    };
    // Devuelve la clase del icono o un icono genérico si no existe.
    return icons[type] || "bi-journal";
}

// Declara una función que actualiza el contador de favoritos.
function updateFavoritesCount() {
    // Muestra en el HTML la cantidad de identificadores guardados como favoritos.
    favoritesCount.textContent = getFavorites().length;
}

// Declara una función para agregar o quitar un recurso de favoritos.
function toggleFavorite(id) {
    // Recupera la lista actual de favoritos.
    const favorites = getFavorites();
    // Convierte el identificador recibido a número para compararlo correctamente.
    const resourceId = Number(id);
    // Comprueba si el recurso ya está guardado y decide si quitarlo o agregarlo.
    const updatedFavorites = favorites.includes(resourceId)
        // Elimina de la lista el recurso que ya estaba guardado.
        ? favorites.filter(favoriteId => favoriteId !== resourceId)
        // Agrega el identificador al arreglo si todavía no estaba guardado.
        : [...favorites, resourceId];
    // Guarda la lista actualizada y comprueba si la operación tuvo éxito.
    if (saveFavorites(updatedFavorites)) {
        // Actualiza el número de favoritos que aparece en pantalla.
        updateFavoritesCount();
        // Vuelve a dibujar las tarjetas para actualizar los corazones y filtros.
        renderResources();
    // Finaliza la condición que verifica el guardado.
    }
}
// Declara la función que construye la tarjeta HTML de un recurso.
/*function createResourceCard(resource) {
    // Comprueba si el recurso debe mostrarse marcado como favorito.
    const favorite = isFavorite(resource.id);
    // Devuelve una plantilla HTML con los datos del recurso.
    return `
        /*Define una columna adaptable según el tamaño de la pantalla.
        <div class="col-12 col-sm-6 col-lg-4">
            <!-- Agrupa el contenido visual de una tarjeta de recurso. -->
            <article class="resource-card">
                <!-- Agrupa la portada, el tipo y el botón de favoritos. -->
                <div class="resource-cover">
                    <!-- Muestra la imagen de portada del recurso. -->
                    <img
                        <!-- Asigna la URL de imagen después de escapar caracteres especiales. -->
                        src="${escapeHTML(resource.image)}"
                        <!-- Proporciona un texto alternativo para accesibilidad. -->
                        alt="Portada de ${escapeHTML(resource.title)}"
                        <!-- Permite cargar la imagen solo cuando se necesite visualizarla. -->
                        loading="lazy"
                        <!-- Oculta la imagen y muestra el icono alternativo si falla la carga. -->
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">
                    <!-- Define la portada alternativa que se mostrará si falla la imagen. -->
                    <div class="resource-cover-fallback" style="display:none">
                        <!-- Muestra el icono que corresponde al tipo de recurso. -->
                        <i class="bi ${getTypeIcon(resource.type)}"></i>
                    <!-- Cierra el contenedor de la portada alternativa. -->
                    </div>
                    <!-- Muestra una etiqueta que identifica el formato del recurso. -->
                    <span class="resource-type-badge">
                        <!-- Muestra el icono correspondiente al formato. -->
                        <i class="bi ${getTypeIcon(resource.type)} me-1"></i>
                        <!-- Muestra el nombre del formato, como Libro o Video. -->
                        ${getTypeLabel(resource.type)}
                    <!-- Cierra la etiqueta del formato. -->
                    </span>
                    <!-- Crea el botón para agregar o quitar el recurso de favoritos. -->
                    <button
                        <!-- Indica que este botón no envía formularios. -->
                        type="button"
                        <!-- Aplica las clases visuales y el estado de favorito. -->
                        class="favorite-button ${favorite ? "is-favorite" : ""}"
                        <!-- Permite identificar la acción al escuchar los clics. -->
                        data-action="favorite"
                        <!-- Guarda el identificador del recurso en el botón. -->
                        data-id="${resource.id}"
                        <!-- Describe la acción del botón para lectores de pantalla. -->
                        aria-label="${favorite ? "Quitar de favoritos" : "Agregar a favoritos"}"
                        <!-- Informa si el botón está activado como favorito. -->
                        aria-pressed="${favorite}">
                        <!-- Muestra un corazón lleno o vacío según el estado del favorito. -->
                        <i class="bi ${favorite ? "bi-heart-fill" : "bi-heart"}"></i>
                    <!-- Cierra el botón de favoritos. -->
                    </button>
                <!-- Cierra el contenedor de portada. -->
                </div>
                <!-- Agrupa el texto y las acciones de la tarjeta. -->
                <div class="resource-body">
                    <!-- Muestra la categoría del recurso. -->
                    <span class="resource-category">
                        <!-- Convierte el código de categoría en un nombre visible. -->
                        ${getCategoryLabel(resource.category)}
                    <!-- Cierra la etiqueta de categoría. -->
                    </span>
                    <!-- Muestra el título del recurso. -->
                    <h4 class="resource-title">
                        <!-- Inserta el título escapando caracteres HTML especiales. -->
                        ${escapeHTML(resource.title)}
                    <!-- Cierra el título. -->
                    </h4>
                    <!-- Muestra la descripción breve del recurso. -->
                    <p class="resource-description">
                        <!-- Inserta la descripción escapando caracteres HTML especiales. -->
                        ${escapeHTML(resource.description)}
                    <!-- Cierra el párrafo descriptivo. -->
                    </p>
                    <!-- Agrupa los datos adicionales del recurso. -->
                    <div class="resource-meta">
                        <!-- Muestra el icono de autor. -->
                        <i class="bi bi-person"></i>
                        <!-- Muestra el nombre del autor o responsable. -->
                        <span>${escapeHTML(resource.author)}</span>
                        <!-- Separa visualmente los datos adicionales. -->
                        <span>·</span>
                        <!-- Muestra el icono de duración. -->
                        <i class="bi bi-clock"></i>
                        <!-- Muestra el formato o duración del material. -->
                        <span>${escapeHTML(resource.duration)}</span>
                    <!-- Cierra los datos adicionales. -->
                    </div>
                    <!-- Agrupa el formato y el botón para abrir detalles. -->
                    <div class="resource-footer">
                        <!-- Muestra la etiqueta del formato en el pie de la tarjeta. -->
                        <span class="resource-format">
                            <!-- Muestra un icono de colección. -->
                            <i class="bi bi-collection me-1"></i>
                            <!-- Muestra el nombre visible del formato. -->
                            ${getTypeLabel(resource.type)}
                        <!-- Cierra la etiqueta del formato. -->
                        </span>
                        <!-- Crea el botón que abrirá los detalles del recurso. -->
                        <button
                            <!-- Evita que el botón envíe un formulario. -->
                            type="button"
                            <!-- Aplica las clases de Bootstrap y del diseño personalizado. -->
                            class="btn btn-details"
                            <!-- Identifica el tipo de acción del botón. -->
                            data-action="details"
                            <!-- Guarda el identificador del recurso en el botón. -->
                            data-id="${resource.id}">
                            <!-- Define el texto que verá el usuario. -->
                            Ver detalles
                            <!-- Muestra una flecha después del texto del botón. -->
                            <i class="bi bi-arrow-right ms-1"></i>
                        <!-- Cierra el botón de detalles. -->
                        </button>
                    <!-- Cierra el pie de la tarjeta. -->
                    </div>
                <!-- Cierra el cuerpo de la tarjeta. -->
                </div>
            <!-- Cierra la tarjeta del recurso. -->
            </article>
        <!-- Cierra la columna adaptable. -->
        </div>
    `;
}*/

function createResourceCard(resource) {
    const favorite = isFavorite(resource.id);

    return `
        <div class="col-12 col-sm-6 col-lg-4">
            <article class="resource-card">
                <div class="resource-cover">
                    <img
                        src="${escapeHTML(resource.image)}"
                        alt="Portada de ${escapeHTML(resource.title)}"
                        loading="lazy"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';">

                    <div class="resource-cover-fallback" style="display:none">
                        <i class="bi ${getTypeIcon(resource.type)}"></i>
                    </div>

                    <span class="resource-type-badge">
                        <i class="bi ${getTypeIcon(resource.type)} me-1"></i>
                        ${getTypeLabel(resource.type)}
                    </span>

                    <button
                        type="button"
                        class="favorite-button ${favorite ? "is-favorite" : ""}"
                        data-action="favorite"
                        data-id="${resource.id}"
                        aria-label="${favorite ? "Quitar de favoritos" : "Agregar a favoritos"}"
                        aria-pressed="${favorite}">
                        <i class="bi ${favorite ? "bi-heart-fill" : "bi-heart"}"></i>
                    </button>
                </div>

                <div class="resource-body">
                    <span class="resource-category">
                        ${getCategoryLabel(resource.category)}
                    </span>

                    <h4 class="resource-title">
                        ${escapeHTML(resource.title)}
                    </h4>

                    <p class="resource-description">
                        ${escapeHTML(resource.description)}
                    </p>

                    <div class="resource-meta">
                        <i class="bi bi-person"></i>
                        <span>${escapeHTML(resource.author)}</span>
                        <span>·</span>
                        <i class="bi bi-clock"></i>
                        <span>${escapeHTML(resource.duration)}</span>
                    </div>

                    <div class="resource-footer">
                        <span class="resource-format">
                            <i class="bi bi-collection me-1"></i>
                            ${getTypeLabel(resource.type)}
                        </span>

                        <button
                            type="button"
                            class="btn btn-details"
                            data-action="details"
                            data-id="${resource.id}">
                            Ver detalles
                            <i class="bi bi-arrow-right ms-1"></i>
                        </button>
                    </div>
                </div>
            </article>
        </div>
    `;
}

// Declara la función que filtra los recursos según los criterios seleccionados.
function getFilteredResources() {
    // Lee la búsqueda, elimina espacios externos y normaliza el texto a minúsculas.
    const query = searchInput.value.trim().toLocaleLowerCase("es");
    // Obtiene la categoría seleccionada en el formulario.
    const category = categoryFilter.value;
    // Obtiene el tipo de recurso seleccionado.
    const type = typeFilter.value;
    // Recupera los identificadores guardados como favoritos.
    const favorites = getFavorites();
    // Recorre los recursos y conserva los que cumplen todos los filtros.
    return resources.filter(resource => {
        // Construye una lista con los campos en los que se permite buscar.
        const searchableText = [
            // Incluye el título en la búsqueda.
            resource.title,
            // Incluye la descripción en la búsqueda.
            resource.description,
            // Incluye el nombre del autor en la búsqueda.
            resource.author,
            // Incluye el nombre visible de la categoría en la búsqueda.
            getCategoryLabel(resource.category),
            // Incluye el nombre visible del tipo en la búsqueda.
            getTypeLabel(resource.type)
        // Une los campos en una cadena y convierte el resultado a minúsculas.
        ].join(" ").toLocaleLowerCase("es");
        // Comprueba si el texto buscado aparece en alguno de los campos.
        const matchesSearch = searchableText.includes(query);
        // Comprueba si la categoría coincide o si se seleccionaron todas.
        const matchesCategory = category === "all" || resource.category === category;
        // Comprueba si el tipo coincide o si se seleccionaron todos.
        const matchesType = type === "all" || resource.type === type;
        // Comprueba si no se está filtrando por favoritos o si el recurso es favorito.
        const matchesFavorites = !showingFavorites || favorites.includes(Number(resource.id));
        // Devuelve verdadero solo si el recurso cumple todos los filtros.
        return matchesSearch && matchesCategory && matchesType && matchesFavorites;
    });
}

// Declara la función que actualiza las tarjetas y los indicadores de la página.
function renderResources() {
    // Obtiene la lista de recursos que cumple los filtros actuales.
    const filteredResources = getFilteredResources();
    // Convierte cada recurso filtrado en una tarjeta HTML y las inserta en la cuadrícula.
    resourcesGrid.innerHTML = filteredResources.map(createResourceCard).join("");
    // Muestra la cantidad de resultados con la palabra en singular o plural.
    resultsCount.textContent = `${filteredResources.length} recurso${filteredResources.length !== 1 ? "s" : ""}`;
    // Cambia el título según se muestren favoritos o todos los recursos.
    resultsTitle.textContent = showingFavorites ? "Mis recursos favoritos" : "Todos los recursos";
    // Oculta el mensaje de lista vacía si existen resultados.
    emptyState.classList.toggle("d-none", filteredResources.length > 0);
    // Oculta la cuadrícula cuando no existen resultados.
    resourcesGrid.classList.toggle("d-none", filteredResources.length === 0);
    // Muestra el botón para borrar la búsqueda cuando el campo contiene texto.
    clearSearchButton.classList.toggle("visible", searchInput.value.length > 0);
    // Aplica la clase visual de activación al botón de favoritos.
    favoritesToggle.classList.toggle("is-active", showingFavorites);
    // Actualiza el atributo de accesibilidad que indica el estado del botón.
    favoritesToggle.setAttribute("aria-pressed", String(showingFavorites));
    // Actualiza el contador de favoritos visible en la página.
    updateFavoritesCount();
}

// Declara la función que limpia la búsqueda y todos los filtros.
function resetFilters() {
    // Vacía el texto del campo de búsqueda.
    searchInput.value = "";
    // Selecciona la opción de todas las categorías.
    categoryFilter.value = "all";
    // Selecciona la opción de todos los tipos.
    typeFilter.value = "all";
    // Desactiva la vista exclusiva de favoritos.
    showingFavorites = false;
    // Recorre todos los botones de categorías rápidas.
    document.querySelectorAll(".category-chip").forEach(chip => {
        // Activa solo el botón cuya categoría representa todas las opciones.
        chip.classList.toggle("active", chip.dataset.category === "all");
    });
    // Vuelve a dibujar los recursos sin filtros.
    renderResources();
}
// Declara la función que abre los detalles de un recurso específico.
/*function openResourceDetails(id) {
    // Busca el recurso cuyo identificador coincide con el recibido.
    const resource = resources.find(item => Number(item.id) === Number(id));
    // Termina la función si no se encontró el recurso solicitado.
    if (!resource) return;
    // Actualiza el título de la ventana modal con el nombre del recurso.
    document.getElementById("modal-title").textContent = resource.title;
    // Busca el contenedor donde se insertará el contenido de la ventana modal.
    const modalContent = document.getElementById("modal-resource-content");
    // Construye el contenido HTML que se mostrará dentro de la ventana modal.
    modalContent.innerHTML = `
        <!-- Muestra la portada del recurso dentro de la ventana modal. -->
        <img
            <!-- Asigna la dirección de la imagen de portada. -->
            class="modal-resource-cover"
            <!-- Carga la imagen usando el valor escapado. -->
            src="${escapeHTML(resource.image)}"
            <!-- Describe la imagen para mejorar la accesibilidad. -->
            alt="Portada de ${escapeHTML(resource.title)}"
            <!-- Oculta la imagen si no puede cargarse. -->
            onerror="this.style.display='none'">
        <!-- Muestra la categoría del recurso. -->
        <span class="resource-category">
            <!-- Convierte el código de categoría en su etiqueta visible. -->
            ${getCategoryLabel(resource.category)}
        <!-- Cierra la etiqueta de categoría. -->
        </span>
        <!-- Muestra la descripción completa del recurso. -->
        <p class="modal-resource-description">
            <!-- Inserta la descripción evitando interpretar caracteres HTML especiales. -->
            ${escapeHTML(resource.description)}
        <!-- Cierra el párrafo descriptivo. -->
        </p>
        <!-- Agrupa los datos adicionales del recurso. -->
        <div class="modal-resource-details">
            <!-- Agrupa el tipo de contenido. -->
            <span>
                <!-- Muestra el icono correspondiente al tipo de recurso. -->
                <i class="bi ${getTypeIcon(resource.type)} me-1"></i>
                <!-- Muestra el nombre visible del tipo de recurso. -->
                ${getTypeLabel(resource.type)}
            <!-- Cierra el dato del tipo de recurso. -->
            </span>
            <!-- Agrupa la información del autor. -->
            <span>
                <!-- Muestra el icono de autor. -->
                <i class="bi bi-person me-1"></i>
                <!-- Muestra el nombre del autor escapado. -->
                ${escapeHTML(resource.author)}
            <!-- Cierra el dato del autor. -->
            </span>
            <!-- Agrupa la información de duración o formato. -->
            <span>
                <!-- Muestra el icono de duración. -->
                <i class="bi bi-clock me-1"></i>
                <!-- Muestra el formato o duración del recurso. -->
                ${escapeHTML(resource.duration)}
            <!-- Cierra el dato de duración. -->
            </span>
        <!-- Cierra el contenedor de datos adicionales. -->
        </div>
        <!-- Crea el botón que permite cambiar el estado de favorito. -->
        <button
            <!-- Indica que el botón no envía formularios. -->
            type="button"
            <!-- Aplica las clases visuales del botón de favoritos. -->
            class="btn btn-favorites"
            <!-- Identifica la acción que ejecutará el botón. -->
            data-action="favorite"
            <!-- Guarda el identificador del recurso en el botón. -->
            data-id="${resource.id}">
            <!-- Muestra el corazón lleno o vacío según el estado actual. -->
            <i class="bi ${isFavorite(resource.id) ? "bi-heart-fill" : "bi-heart"}"></i>
            <!-- Muestra el texto correspondiente al estado del favorito. -->
            ${isFavorite(resource.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
        <!-- Cierra el botón de favoritos. -->
        </button>
    `;
    // Busca el enlace que permite abrir el recurso externo.
    const resourceLink = document.getElementById("modal-resource-link");
    // Asigna la URL del recurso o un enlace vacío como alternativa.
    resourceLink.href = resource.url || "#";
    // Oculta el enlace externo si el recurso no tiene una URL.
    resourceLink.classList.toggle("d-none", !resource.url);
    // Abre la ventana modal de Bootstrap.
    resourceModal.show();
}*/
function openResourceDetails(id) {
    // Busca el recurso cuyo identificador coincide con el recibido.
    const resource = resources.find(item => Number(item.id) === Number(id));
    // Termina la función si no se encontró el recurso solicitado.
    if (!resource) return;
    // Actualiza el título de la ventana modal con el nombre del recurso.
    document.getElementById("modal-title").textContent = resource.title;
    // Busca el contenedor donde se insertará el contenido de la ventana modal.
    const modalContent = document.getElementById("modal-resource-content");
    // Construye el contenido HTML que se mostrará dentro de la ventana modal.
    modalContent.innerHTML = `
        <img
            class="modal-resource-cover"
            src="${escapeHTML(resource.image)}"
            alt="Portada de ${escapeHTML(resource.title)}"
            onerror="this.style.display='none'">
        <span class="resource-category">
            ${getCategoryLabel(resource.category)}
        </span>
        <p class="modal-resource-description">
            ${escapeHTML(resource.description)}
        </p>
        <div class="modal-resource-details">
            <span>
                <i class="bi ${getTypeIcon(resource.type)} me-1"></i>
                ${getTypeLabel(resource.type)}
            </span>
            <span>
                <i class="bi bi-person me-1"></i>
                ${escapeHTML(resource.author)}
            </span>
            <span>
                <i class="bi bi-clock me-1"></i>
                ${escapeHTML(resource.duration)}
            </span>
        </div>
        <button
            type="button"
            class="btn btn-favorites"
            data-action="favorite"
            data-id="${resource.id}">
            <i class="bi ${isFavorite(resource.id) ? "bi-heart-fill" : "bi-heart"}"></i>
            ${isFavorite(resource.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
        </button>
    `;
    // Busca el enlace que permite abrir el recurso externo.
    const resourceLink = document.getElementById("modal-resource-link");
    // Asigna la URL del recurso o un enlace vacío como alternativa.
    resourceLink.href = resource.url || "#";
    // Oculta el enlace externo si el recurso no tiene una URL.
    resourceLink.classList.toggle("d-none", !resource.url);
    // Abre la ventana modal de Bootstrap.
    resourceModal.show();
}


// Registra el evento que vuelve a dibujar los recursos cuando cambia la búsqueda.
searchInput.addEventListener("input", renderResources);

// Registra el evento que se ejecuta cuando cambia la categoría seleccionada.
categoryFilter.addEventListener("change", () => {
    // Desactiva la vista exclusiva de favoritos al cambiar la categoría.
    showingFavorites = false;
    // Recorre los botones de categorías rápidas.
    document.querySelectorAll(".category-chip").forEach(chip => {
        // Activa el botón cuya categoría coincide con la seleccionada.
        chip.classList.toggle("active", chip.dataset.category === categoryFilter.value);
    });
    // Actualiza los recursos según la nueva categoría.
    renderResources();
// Cierra la función del evento de cambio de categoría.
});

// Registra el evento que actualiza los recursos cuando cambia el tipo seleccionado.
typeFilter.addEventListener("change", renderResources);

// Registra el clic en el botón que limpia el campo de búsqueda.
clearSearchButton.addEventListener("click", () => {
    // Borra el texto escrito en el campo de búsqueda.
    searchInput.value = "";
    // Actualiza la biblioteca sin el texto de búsqueda anterior.
    renderResources();
    // Devuelve el cursor al campo de búsqueda para facilitar otra consulta.
    searchInput.focus();
// Cierra la función del evento del botón de limpieza.
});

// Busca el botón que restablece todos los filtros y registra su evento de clic.
document.getElementById("reset-filters").addEventListener("click", resetFilters);

// Busca el botón de reinicio que aparece cuando no hay resultados.
document.getElementById("empty-reset").addEventListener("click", resetFilters);

// Busca todos los botones de categorías rápidas.
document.querySelectorAll(".category-chip").forEach(chip => {
    // Registra un evento de clic para cada botón de categoría.
    chip.addEventListener("click", () => {
        // Actualiza el filtro de categoría con el valor del botón pulsado.
        categoryFilter.value = chip.dataset.category;
        // Desactiva la vista exclusiva de favoritos.
        showingFavorites = false;
        // Recorre todos los botones de categorías rápidas.
        document.querySelectorAll(".category-chip").forEach(item => {
            // Activa visualmente solo el botón que el usuario pulsó.
            item.classList.toggle("active", item === chip);
        });
        // Actualiza las tarjetas según la categoría seleccionada.
        renderResources();
    // Cierra la función del clic de categoría.
    });
// Cierra el recorrido de los botones de categoría.
});

// Registra el clic para alternar entre todos los recursos y los favoritos.
favoritesToggle.addEventListener("click", () => {
    // Invierte el estado actual de la vista de favoritos.
    showingFavorites = !showingFavorites;
    // Actualiza las tarjetas según el nuevo estado de la vista.
    renderResources();
// Cierra la función del clic de favoritos.
});

// Registra un solo evento para gestionar los clics dentro de la cuadrícula dinámica.
resourcesGrid.addEventListener("click", event => {
    // Busca el botón con una acción dentro del elemento donde se hizo clic.
    const button = event.target.closest("[data-action]");
    // Termina la función si el clic no ocurrió dentro de un botón de acción.
    if (!button) return;
    // Extrae del botón los valores de data-action y data-id.
    const { action, id } = button.dataset;
    // Comprueba si el usuario pulsó el botón de favoritos.
    if (action === "favorite") {
        // Agrega o quita el recurso de favoritos.
        toggleFavorite(id);
    // Cierra la condición de favoritos.
    }
    // Comprueba si el usuario pulsó el botón de detalles.
    if (action === "details") {
        // Abre la ventana modal del recurso seleccionado.
        openResourceDetails(id);
    // Cierra la condición de detalles.
    }
// Cierra el evento de clic de la cuadrícula.
});

// Busca el contenedor de detalles y registra los clics dentro de él.
document.getElementById("modal-resource-content").addEventListener("click", event => {
    // Busca el botón de favoritos dentro del contenido del modal.
    const button = event.target.closest('[data-action="favorite"]');
    // Termina la función si el clic no corresponde al botón de favoritos.
    if (!button) return;
    // Cambia el estado de favorito del recurso indicado en el botón.
    toggleFavorite(button.dataset.id);
    // Busca el recurso asociado al botón pulsado.
    const resource = resources.find(item => Number(item.id) === Number(button.dataset.id));
    // Comprueba que el recurso exista antes de actualizar su botón.
    if (resource) {
        // Obtiene el nuevo estado de favorito del recurso.
        const favorite = isFavorite(resource.id);
        // Actualiza el contenido del botón con el corazón y texto correspondientes.
        button.innerHTML = `
            <!-- Muestra el corazón lleno o vacío según el estado del favorito. -->
            <i class="bi ${favorite ? "bi-heart-fill" : "bi-heart"}"></i>
            <!-- Muestra la acción que puede realizarse sobre el favorito. -->
            ${favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
        `;
    // Cierra la condición que comprueba la existencia del recurso.
    }
// Cierra el evento de clic dentro del modal.
});

/*
// Indica que esta sección está preparada para obtener recursos desde una API.
// Define la función asíncrona que solicitará los recursos al backend.
async function loadResourcesFromAPI() {
    // Define la ruta del endpoint que entregará los recursos.
    const API_URL = "/api/resources";
    // Inicia el bloque protegido para gestionar errores de la petición.
    try {
        // Envía una petición HTTP y espera la respuesta del servidor.
        const response = await fetch(API_URL);
        // Comprueba si la respuesta HTTP indica un error.
        if (!response.ok) {
            // Lanza un error que incluye el código HTTP recibido.
            throw new Error(`HTTP ${response.status}`);
        // Cierra la condición de respuesta no exitosa.
        }
        // Convierte el cuerpo de la respuesta a datos de JavaScript.
        const data = await response.json();
        // Comprueba que la respuesta sea una lista de recursos.
        if (!Array.isArray(data)) {
            // Lanza un error si la API no devuelve un arreglo.
            throw new Error("La API no devolvió una lista de recursos.");
        // Cierra la condición que valida el formato de la respuesta.
        }
        // Sustituye los recursos de ejemplo por los datos recibidos del backend.
        resources = data;
        // Actualiza las tarjetas para mostrar los datos recibidos.
        renderResources();
    // Captura los errores de conexión, respuesta o procesamiento.
    } catch (error) {
        // Muestra el error en la consola para facilitar la depuración.
        console.error("Error cargando recursos desde el backend:", error);
    // Cierra el bloque de manejo de errores.
    }
// Cierra la función que obtiene los recursos desde la API.
}

// Marca el inicio de la inicialización de la biblioteca.
// Declara la función que prepara la página al cargar el JavaScript.
function initLibrary() {
    // Dibuja las tarjetas iniciales usando los recursos de ejemplo.
    renderResources();
    // Actualiza el contador inicial de favoritos.
    updateFavoritesCount();
}

// Ejecuta la inicialización de la biblioteca.
initLibrary();
*/