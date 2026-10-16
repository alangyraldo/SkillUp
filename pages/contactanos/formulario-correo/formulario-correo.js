const form = document.querySelector(".fomulario-correo"); if (form) {
    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        if (!validarFormulario()) return;
        form.submit();
    });
}