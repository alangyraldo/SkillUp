(function () {
  document.head.insertAdjacentHTML('beforeend', `<style>
    .aviso {
      position: fixed; top: 24px; left: 50%; z-index: 9999;
      display: flex; align-items: center; gap: 12px;
      width: max-content; max-width: calc(100vw - 48px);
      padding: 14px 18px;
      background: var(--blanco, #fff);
      color: var(--azul-oscuro, #11142D);
      border: 1px solid var(--color-borde, #E2E8F0);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(17, 20, 45, 0.12);
      font: 500 0.875rem 'Montserrat', sans-serif;
      opacity: 0; transform: translate(-50%, -12px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .aviso.visible { opacity: 1; transform: translate(-50%, 0); }
    .aviso-icono {
      display: grid; place-items: center; flex-shrink: 0;
      width: 28px; height: 28px; border-radius: 50%;
      background: var(--lavanda-claro, #E9E5FF);
      color: var(--purpura-principal, #5B2EFF);
    }
    .aviso-error .aviso-icono { background: #FEE2E2; color: #DC2626; }

    /* Estilos para modales de confirmación y entrada de datos */
    .aviso-overlay {
      position: fixed; inset: 0; z-index: 9999;
      display: grid; place-items: center; padding: 16px;
      background: rgba(17, 20, 45, 0.45);
      backdrop-filter: blur(2px);
      opacity: 0; transition: opacity 0.2s ease;
    }
    .aviso-overlay.visible { opacity: 1; }
    .aviso-modal {
      width: 100%; max-width: 400px; padding: 24px;
      background: var(--blanco, #fff);
      color: var(--azul-oscuro, #11142D);
      border: 1px solid var(--color-borde, #E2E8F0);
      border-radius: 16px;
      box-shadow: 0 16px 40px rgba(17, 20, 45, 0.18);
      font-family: 'Montserrat', sans-serif;
    }
    .aviso-modal h3 { margin: 0 0 8px; font-size: 1.05rem; font-weight: 700; }
    .aviso-modal p { margin: 0 0 18px; font-size: 0.875rem; color: #64748B; line-height: 1.45; }
    .aviso-modal input {
      width: 100%; box-sizing: border-box; margin-bottom: 18px; padding: 10px 14px;
      border: 1px solid var(--color-borde, #CBD5E1); border-radius: 10px;
      font: 500 0.875rem 'Montserrat', sans-serif; color: var(--azul-oscuro, #11142D);
      outline: none;
    }
    .aviso-modal input:focus { border-color: var(--purpura-principal, #5B2EFF); }
    .aviso-acciones { display: flex; justify-content: flex-end; gap: 10px; }
    .aviso-btn {
      padding: 9px 16px; border-radius: 10px; border: none; cursor: pointer;
      font: 600 0.85rem 'Montserrat', sans-serif; transition: opacity 0.2s;
    }
    .aviso-btn:hover { opacity: 0.9; }
    .aviso-btn-sec { background: #F1F5F9; color: #475569; }
    .aviso-btn-pri { background: var(--purpura-principal, #5B2EFF); color: #fff; }
  </style>`);

  const svg = (d) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="${d}"/></svg>`;
  const iconos = { exito: svg('M20 6 9 17l-5-5'), error: svg('M18 6 6 18M6 6l12 12') };

  window.mostrarAviso = function (texto, tipo = 'exito', ms = 3000) {
    document.querySelectorAll('.aviso').forEach((a) => a.remove());
    const el = document.createElement('div');
    el.className = 'aviso aviso-' + tipo;
    el.setAttribute('role', 'status');
    el.innerHTML = `<span class="aviso-icono">${iconos[tipo]}</span><span></span>`;
    el.lastChild.textContent = texto;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));
    setTimeout(() => {
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 300);
    }, ms);
  };

  // Reemplazo estilizado de confirm()
  window.confirmarAviso = function (titulo, mensaje = '', textoConfirmar = 'Aceptar') {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'aviso-overlay';
      overlay.innerHTML = `
        <div class="aviso-modal" role="dialog" aria-modal="true">
          <h3></h3>
          ${mensaje ? '<p></p>' : ''}
          <div class="aviso-acciones">
            <button type="button" class="aviso-btn aviso-btn-sec" data-res="0">Cancelar</button>
            <button type="button" class="aviso-btn aviso-btn-pri" data-res="1"></button>
          </div>
        </div>`;
      overlay.querySelector('h3').textContent = titulo;
      if (mensaje) overlay.querySelector('p').textContent = mensaje;
      overlay.querySelector('[data-res="1"]').textContent = textoConfirmar;

      const cerrar = (val) => {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 200);
        resolve(val);
      };

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) cerrar(false);
        const btn = e.target.closest('[data-res]');
        if (btn) cerrar(btn.dataset.res === '1');
      });

      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add('visible'));
    });
  };

  // Reemplazo estilizado de prompt()
  window.pedirDatoAviso = function (titulo, placeholder = '', textoConfirmar = 'Guardar') {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'aviso-overlay';
      overlay.innerHTML = `
        <form class="aviso-modal" role="dialog" aria-modal="true">
          <h3></h3>
          <input type="text" required>
          <div class="aviso-acciones">
            <button type="button" class="aviso-btn aviso-btn-sec" id="avisoCancelar">Cancelar</button>
            <button type="submit" class="aviso-btn aviso-btn-pri"></button>
          </div>
        </form>`;
      const input = overlay.querySelector('input');
      overlay.querySelector('h3').textContent = titulo;
      input.placeholder = placeholder;
      overlay.querySelector('[type="submit"]').textContent = textoConfirmar;

      const cerrar = (val) => {
        overlay.classList.remove('visible');
        setTimeout(() => overlay.remove(), 200);
        resolve(val);
      };

      overlay.querySelector('#avisoCancelar').addEventListener('click', () => cerrar(null));
      overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(null); });
      overlay.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        cerrar(input.value.trim());
      });

      document.body.appendChild(overlay);
      requestAnimationFrame(() => {
        overlay.classList.add('visible');
        input.focus();
      });
    });
  };
})();