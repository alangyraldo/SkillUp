(function () {
  document.head.insertAdjacentHTML('beforeend', `<style>
        .aviso {
      position: fixed; top: 24px; left: 50%; z-index: 2000;
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
})();