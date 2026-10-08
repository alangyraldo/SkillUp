const includes = [...document.querySelectorAll('[data-include]')].map(async (el) => {
  const res = await fetch(el.dataset.include);
  el.innerHTML = await res.text();
});

loadSharedComponents().then(iniciarAnimaciones);

function iniciarAnimaciones() {
 const items = document.querySelectorAll('.card, .valor-card');
  items.forEach((el) => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el) => observer.observe(el));
}

