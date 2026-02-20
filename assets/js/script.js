document.addEventListener('DOMContentLoaded', () => {
    
    // Inicializar funciones
    initMobileMenu();
    initCounter();
    initStickyHeader();
    initCopyClipboard();
    initScrollReveal(); 
    initTermsModal();

    /* 1. SCROLL REVEAL (La magia de las animaciones) */
    function initScrollReveal() {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px', 
            threshold: 0.1 
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // OJO: Aquí están las clases que NO deben tener 'anim-up' en el HTML
        const selectors = [
            '.symptoms__card', 
            '.treatments__card', 
            '.contact-card', 
            '.bio-rounded-card', 
            '.location__map-block', 
            '.location__card'
        ];

        const elements = document.querySelectorAll(selectors.join(','));
        elements.forEach(el => observer.observe(el));
    }

    /* =========================================
       2. MENÚ MÓVIL (CORREGIDO)
       ========================================= */
    function initMobileMenu() {
        const toggleBtn = document.querySelector('.header__toggle');
        // AHORA APUNTAMOS A LA CLASE CORRECTA DE TU HTML
        const nav = document.querySelector('.header-pill__nav'); 
        
        if (!toggleBtn || !nav) return;

        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            
            // Usamos la clase .is-active que definimos en el CSS nuevo
            nav.classList.toggle('is-active'); 
            
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            toggleBtn.textContent = isExpanded ? '☰' : '✕';
            
            // Opcional: Bloquear scroll si quieres
            // document.body.style.overflow = isExpanded ? '' : 'hidden';
        });

        // Cerrar al dar clic en un enlace
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('is-active');
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.textContent = '☰';
                // document.body.style.overflow = '';
            });
        });
    }

    /* 3. CONTADOR */
    function initCounter() {
        const counterElement = document.getElementById('experience-counter');
        if (!counterElement) return;
        const targetNumber = parseInt(counterElement.getAttribute('data-target'));
        const duration = 2000;
        let hasStarted = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasStarted) {
                    hasStarted = true;
                    animateValue(counterElement, 0, targetNumber, duration);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(counterElement);
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) window.requestAnimationFrame(step);
            else obj.innerHTML = end;
        };
        window.requestAnimationFrame(step);
    }

    /* 4. HEADER STICKY */
    function initStickyHeader() {
        const header = document.querySelector('.header-pill'); 
        if(!header) return;
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('header--scrolled');
            else header.classList.remove('header--scrolled');
        });
    }

    /* 5. COPY CLIPBOARD */
    function initCopyClipboard() {
        let tooltip = document.querySelector('.copy-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'copy-tooltip';
            document.body.appendChild(tooltip);
        }
        const copyableElements = document.querySelectorAll('.copyable');
        copyableElements.forEach(element => {
            element.addEventListener('click', () => {
                const textToCopy = element.getAttribute('data-text');
                if(textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        tooltip.textContent = `Copiado: ${textToCopy}`;
                        tooltip.classList.add('show');
                        setTimeout(() => { tooltip.classList.remove('show'); }, 2000);
                    });
                }
            });
        });
    }

    /* 6. MODAL TERMINOS */
    function initTermsModal() {
        const modal = document.getElementById('terms-modal');
        const openBtn = document.querySelector('.js-open-terms');
        const closeBtn = document.getElementById('btn-close-terms');
        const acceptBtn = document.getElementById('btn-accept-terms');
        if (!modal) return;
        
        const closeModal = () => {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
        };

        if (openBtn) openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        });
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (acceptBtn) acceptBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
});