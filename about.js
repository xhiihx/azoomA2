// Smooth height animation with auto height support
const items = document.querySelectorAll('.faq-item');

function closeItem(item) {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    btn.setAttribute('aria-expanded', 'false');

    // From current height to 0
    panel.style.height = panel.scrollHeight + 'px';
    requestAnimationFrame(() => {
        panel.style.height = '0px';
    });

    panel.addEventListener('transitionend', () => {
        item.classList.remove('open');
    }, { once: true });
}

function openItem(item) {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');
    btn.setAttribute('aria-expanded', 'true');
    item.classList.add('open');

    panel.hidden = false;
    panel.style.height = 'auto';       // reset if previously set
    const target = panel.scrollHeight;
    panel.style.height = '0px';
    requestAnimationFrame(() => {
        panel.style.height = target + 'px';
    });

    panel.addEventListener('transitionend', () => {
        panel.style.height = 'auto';
    }, { once: true });
}

items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const panel = item.querySelector('.faq-a');

    // Ensure initial state
    panel.hidden = true;
    panel.style.height = '0px';
    btn.setAttribute('aria-expanded', 'false');

    //Toggle
    btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(i => { if (i !== item && i.classList.contains('open')) closeItem(i); });
        isOpen ? closeItem(item) : openItem(item);
    });
});