async function loadComponent(elementId, filePath) {
    const container = document.getElementById(elementId);
    if (!container) return;
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(
                `No se pudo cargar el archivo: ${filePath} (Status: ${response.status})`
            );
        }
        const html = await response.text();
        // Reemplaza el contenedor por el componente
        container.outerHTML = html;
    } catch (error) {
        console.error(
            `[Componentes] Error al cargar ${filePath}:`,
            error
        );
        if (window.location.protocol === 'file:') {
            console.warn(
                'Usa un servidor local como Live Server en VS Code para probar los componentes.'
            );
        }
    }
}


/**
 * Carga todos los componentes compartidos
 */
async function loadSharedComponents() {
    return Promise.all([
        loadComponent('header', 'header.html'),
        loadComponent('nosotros', 'nosotros.html'),
    ]);
}


/**
 * Cargar componentes cuando el DOM esté listo
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',loadSharedComponents
    );
} else {
    loadSharedComponents();

}


/**
 * Exponer funciones globalmente
 */
if (typeof window !== 'undefined') {

    window.loadComponent = loadComponent;

    window.loadSharedComponents = loadSharedComponents;

}