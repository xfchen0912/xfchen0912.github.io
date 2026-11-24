(function () {
  const navButton = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  navButton?.addEventListener('click', function () {
    const open = nav.classList.toggle('open');
    navButton.setAttribute('aria-expanded', String(open));
  });

  nav?.addEventListener('click', function (event) {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      navButton?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      nav?.classList.remove('open');
      navButton?.setAttribute('aria-expanded', 'false');
    }
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  }

  const modelTrigger = document.getElementById('scmagnify-model-trigger');
  const modelDialog = document.getElementById('scmagnify-model');
  if (modelTrigger && typeof modelDialog?.showModal === 'function') {
    modelTrigger.setAttribute('aria-haspopup', 'dialog');
    modelTrigger.setAttribute('aria-controls', modelDialog.id);
    modelTrigger.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      modelDialog.showModal();
    });
  }

  document.querySelectorAll('[data-explore]').forEach((explorer) => {
    const buttons = explorer.querySelectorAll('button[data-region]');
    const note = explorer.querySelector('[data-explore-note]');
    const defaultNote = note.textContent;
    let selected = null;
    note.hidden = false;

    function display(button) {
      if (button) explorer.dataset.activeRegion = button.dataset.region;
      else delete explorer.dataset.activeRegion;
      note.textContent = button?.dataset.note ?? defaultNote;
    }

    buttons.forEach((button) => {
      button.hidden = false;
      button.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'mouse') display(button);
      });
      button.addEventListener('pointerleave', (event) => {
        if (event.pointerType === 'mouse') display(selected);
      });
      button.addEventListener('focus', () => display(button));
      button.addEventListener('blur', () => display(selected));
      button.addEventListener('click', () => {
        selected?.setAttribute('aria-pressed', 'false');
        selected = selected === button ? null : button;
        selected?.setAttribute('aria-pressed', 'true');
        display(selected);
      });
    });
  });

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
