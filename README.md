# SkillUp — arquitectura modular

## Ejecutar el proyecto
1. Descomprime la carpeta `SkillUp-modular`.
2. Ábrela en Visual Studio Code.
3. Ejecuta `index.html` con Live Server. No abras los HTML con `file://`, porque los componentes compartidos se cargan con `fetch`.

## Estructura
- `index.html`: página de inicio original, con las tarjetas del equipo y la sección de valores.
- `pages/`: páginas independientes: nosotros, biblioteca, buscar tutor, contactanos, iniciar sesión, registro, agendar tutoría y dashboard admin.
- `components/`: encabezado, pie de página y sección de valores reutilizables.
- `css/`: estilos globales, de inicio, componentes y módulos.
- `js/app.js`: carga header/footer/valores, resuelve rutas entre páginas y controla validaciones de interfaz.
- `assets/images/`: imágenes originales y logotipos.
- `source-original/`: copia de los archivos de origen para consulta; no se carga en el sitio.

## Notas
Se conservó el contenido original disponible para inicio, nosotros y valores. Las demás páginas son bases de interfaz para desarrollar cada funcionalidad; búsquedas, autenticación, envío de mensajes, reservas y datos de administración necesitan backend para operar con información real.
