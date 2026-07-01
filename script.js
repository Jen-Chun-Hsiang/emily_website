// Shared background motion preference, persisted across pages.
const motionState = (() => {
    const STORAGE_KEY = 'background-motion';
    const prefersReducedMotion = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const read = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'on') return true;
            if (stored === 'off') return false;
        } catch (e) { /* storage may be unavailable */ }
        return !prefersReducedMotion; // default: on, unless the OS asks for less motion
    };

    const listeners = new Set();
    let enabled = read();

    return {
        get enabled() { return enabled; },
        set(value) {
            enabled = value;
            try {
                localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
            } catch (e) { /* ignore */ }
            listeners.forEach((fn) => fn(value));
        },
        subscribe(fn) { listeners.add(fn); },
    };
})();

const initMatrixBackground = () => {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas || typeof canvas.getContext !== 'function') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Characters to use (Traditional Chinese + Bengali + Japanese + Greek/Math + Latin + Numerals)
    // Note: We sample characters from these source texts, removing whitespace, to drive the rain.
    const chineseSource = `白日依山尽，
黄河入海流。
欲穷千里目，
更上一层楼。
`;
    const bengaliSource = `চিত্ত যেথা ভয়শূন্য, উচ্চ যেথা শির জ্ঞান যেথা মুক্ত, যেথা গৃহের প্রাচীর আপন প্রাঙ্গণতলে দিবসশর্বরী
বসুধারে রাখে নাই খণ্ড ক্ষুদ্র করি,
যেথা বাক্য হৃদয়ের উৎসমুখ হতে
উচ্ছ্বসিয়া উঠে, যেথা নির্বারিত স্রোতে
দেশে দেশে দিশে দিশে কর্মধারা ধায়
অজস্র সহস্রবিধ চরিতার্থতায়--
যেথা তুচ্ছ আচারের মরুবালুরাশি
বিচারের স্রোতঃপথ ফেলে নাই গ্রাসি,
পৌরুষেরে করে নি শতধা; নিত্য যেথা
তুমি সর্ব কর্ম চিন্তা আনন্দের নেতা--
নিজ হস্তে নির্দয় আঘাত করি, পিতঃ,
ভারতেরে সেই স্বর্গে করো জাগরিত।
`;
    const japaneseSource =
        'そらにはちりのやうに小鳥がとび\n'
        + 'かげろふや青いギリシヤ文字は\n'
        + 'せはしく野はらの雪に燃えます\n'
        + 'パツセン大街道のひのきからは\n'
        + '凍つたしづくが燦々と降り\n';

    const greek = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω';
    const mathSymbols = '∑∏√∞≈≠≤≥±×÷∂∫∇πθμλ→←↔•·';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';

    const uniqueChars = (text) => {
        const seen = new Set();
        const chars = [];

        for (const ch of text) {
            if (ch.trim() === '') continue;
            if (!seen.has(ch)) {
                seen.add(ch);
                chars.push(ch);
            }
        }

        return chars;
    };

    const alphabet = [
        ...uniqueChars(chineseSource),
        ...uniqueChars(bengaliSource),
        ...uniqueChars(japaneseSource),
        ...uniqueChars(greek + mathSymbols + latin + nums),
    ];

    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    const drops = Array.from(
        { length: columns },
        () => Math.random() * (height / fontSize)
    );

    const draw = () => {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = alphabet[Math.floor(Math.random() * alphabet.length)];
            ctx.fillStyle = Math.random() > 0.98 ? '#1a1a1a' : '#555555';
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    };

    let isScrolling = false;
    let scrollTimeout = null;
    let lastFrame = 0;
    let animationFrame = null;
    const frameInterval = 33;

    const animate = (timestamp) => {
        if (isScrolling && timestamp - lastFrame >= frameInterval) {
            draw();
            lastFrame = timestamp;
        }

        if (isScrolling) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            animationFrame = null;
        }
    };

    const startAnimation = () => {
        if (animationFrame === null) {
            animationFrame = requestAnimationFrame(animate);
        }
    };

    for (let i = 0; i < 40; i++) {
        draw();
    }

    window.addEventListener('scroll', () => {
        if (!motionState.enabled) return;
        isScrolling = true;
        startAnimation();

        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { isScrolling = false; }, 120);
    }, { passive: true });

    // Halt any in-flight animation the moment motion is switched off.
    motionState.subscribe((enabled) => {
        if (!enabled) isScrolling = false;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        const newColumns = Math.floor(width / fontSize);

        if (newColumns > columns) {
            for (let x = columns; x < newColumns; x++) {
                drops[x] = Math.random() * (height / fontSize);
            }
        }

        drops.length = newColumns;
        columns = newColumns;
    });
};

initMatrixBackground();

const initMotionToggle = () => {
    const button = document.querySelector('.background-motion-toggle');
    if (!button) return;

    const apply = (enabled) => {
        button.textContent = enabled ? 'Pause background motion' : 'Resume background motion';
        button.dataset.motionState = enabled ? 'running' : 'paused';
        button.setAttribute('aria-pressed', String(enabled));
        button.title = enabled
            ? 'Pause the moving background'
            : 'Resume the moving background';
    };

    apply(motionState.enabled);
    motionState.subscribe(apply);
    button.addEventListener('click', () => motionState.set(!motionState.enabled));
};

initMotionToggle();

const initReferenceRail = () => {
    const rail = document.querySelector('.reference-rail');
    if (!rail) return;

    const cards = Array.from(document.querySelectorAll('.reference-card'));
    const groups = Array.from(document.querySelectorAll('.reference-group'));
    const sections = Array.from(document.querySelectorAll('.article-section[data-refs]'))
        .filter((section) => section.dataset.refs);
    const evidenceBlocks = Array.from(document.querySelectorAll('.article-body p[data-refs]'));
    const observedTargets = evidenceBlocks.length > 0 ? evidenceBlocks : sections;
    const status = document.getElementById('reference-status');
    const filter = document.getElementById('reference-filter');
    const reset = document.getElementById('show-all-references');
    const refLinks = Array.from(document.querySelectorAll('[data-ref-link]'));
    const list = rail.querySelector('.reference-list');

    const prefersReducedMotion = window.matchMedia
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // A manual click "pins" one reference so the scroll observer cannot
    // immediately overwrite it. The pin releases once the reader scrolls
    // the article away from where they clicked, handing control back to
    // the ambient (scroll-driven) highlighting.
    let pinnedRef = null;
    let pinAnchor = 0;
    let pinGraceUntil = 0;

    const pin = (ref) => {
        pinnedRef = ref;
        pinAnchor = window.scrollY;
        // Ignore the programmatic smooth-scroll that a click may start.
        pinGraceUntil = performance.now() + 700;
    };

    const unpin = () => {
        pinnedRef = null;
    };

    window.addEventListener('scroll', () => {
        if (pinnedRef === null) return;
        if (performance.now() < pinGraceUntil) {
            pinAnchor = window.scrollY;
            return;
        }
        if (Math.abs(window.scrollY - pinAnchor) > 80) unpin();
    }, { passive: true });

    // On wide layouts the rail is sticky beside the article, so we scroll
    // only the rail's internal list — never the page. On stacked (mobile)
    // layouts the rail sits below the article, so bringing the card into
    // the viewport is the right move.
    const isStacked = () => window.matchMedia('(max-width: 1180px)').matches;

    const scrollCardIntoView = (card) => {
        const behavior = prefersReducedMotion ? 'auto' : 'smooth';

        if (isStacked() || !list) {
            card.scrollIntoView({ block: 'center', behavior });
            return;
        }

        const cardRect = card.getBoundingClientRect();
        const listRect = list.getBoundingClientRect();
        const delta = (cardRect.top - listRect.top)
            - (list.clientHeight - cardRect.height) / 2;
        list.scrollBy({ top: delta, behavior });
    };

    const refsForTarget = (target) => new Set(
        (target.dataset.refs || '')
            .split(',')
            .map((ref) => ref.trim())
            .filter(Boolean)
    );

    const labelForTarget = (target) => {
        if (target.dataset.refLabel) return target.dataset.refLabel;

        const section = target.closest('.article-section') || target;
        return section.querySelector('h2')?.textContent || 'current evidence';
    };

    const updateGroupVisibility = () => {
        groups.forEach((group) => {
            let sibling = group.nextElementSibling;
            let hasVisibleCard = false;

            while (sibling && !sibling.classList.contains('reference-group')) {
                if (sibling.classList.contains('reference-card') && !sibling.classList.contains('is-hidden')) {
                    hasVisibleCard = true;
                    break;
                }

                sibling = sibling.nextElementSibling;
            }

            group.classList.toggle('is-hidden', !hasVisibleCard);
        });
    };

    const clearSelected = () => {
        cards.forEach((card) => card.classList.remove('is-selected'));
        refLinks.forEach((link) => link.classList.remove('is-selected'));
        sections.forEach((section) => section.classList.remove('has-selected-ref'));
        evidenceBlocks.forEach((block) => block.classList.remove('has-selected-ref'));
    };

    const setActiveReferences = (refs, label) => {
        cards.forEach((card) => {
            const isRelevant = refs.has(card.dataset.ref);
            card.classList.remove('is-hidden');
            card.classList.toggle('is-relevant', isRelevant);
            card.classList.toggle('is-muted', refs.size > 0 && !isRelevant);
        });

        groups.forEach((group) => group.classList.remove('is-hidden'));

        if (status && label) {
            status.textContent = `Showing sources for: ${label}`;
        }
    };

    const selectReference = (ref, shouldScroll = true) => {
        const card = document.getElementById(`ref-${ref}`);
        if (!card) return;

        pin(ref);

        // Deterministic spotlight: the clicked card is selected, every
        // other card is muted, regardless of any leftover ambient state.
        cards.forEach((item) => {
            const isSelected = item === card;
            item.classList.remove('is-hidden');
            item.classList.toggle('is-selected', isSelected);
            item.classList.toggle('is-relevant', isSelected);
            item.classList.toggle('is-muted', !isSelected);
        });
        groups.forEach((group) => group.classList.remove('is-hidden'));

        refLinks.forEach((link) => link.classList.toggle('is-selected', link.dataset.refLink === ref));

        sections.forEach((section) => {
            section.classList.remove('is-active');
            section.classList.toggle('has-selected-ref', refsForTarget(section).has(ref));
        });

        evidenceBlocks.forEach((block) => {
            block.classList.remove('is-active-evidence');
            block.classList.toggle('has-selected-ref', refsForTarget(block).has(ref));
        });

        if (status) {
            const group = card.dataset.group ? ` · ${card.dataset.group}` : '';
            status.textContent = `Reference ${ref}${group}`;
        }

        if (shouldScroll) scrollCardIntoView(card);
    };

    const showAllReferences = () => {
        unpin();
        clearSelected();
        cards.forEach((card) => {
            card.classList.remove('is-hidden', 'is-muted', 'is-relevant');
        });
        groups.forEach((group) => group.classList.remove('is-hidden'));

        if (filter) filter.value = '';
        if (status) {
            status.textContent = 'Showing all references. Scroll evidence paragraphs to re-focus the rail.';
        }
    };

    const applyFilter = () => {
        if (!filter) return;

        const query = filter.value.trim().toLowerCase();
        unpin();
        clearSelected();

        if (!query) {
            showAllReferences();
            return;
        }

        let visibleCount = 0;

        cards.forEach((card) => {
            const text = `${card.dataset.ref} ${card.dataset.group || ''} ${card.textContent}`.toLowerCase();
            const isVisible = text.includes(query);
            card.classList.toggle('is-hidden', !isVisible);
            card.classList.remove('is-muted', 'is-relevant');
            if (isVisible) visibleCount += 1;
        });

        updateGroupVisibility();

        if (status) {
            status.textContent = `${visibleCount} reference${visibleCount === 1 ? '' : 's'} matching "${filter.value.trim()}"`;
        }
    };

    refLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const ref = link.dataset.refLink;

            if (filter) filter.value = '';
            selectReference(ref);

            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', `#ref-${ref}`);
            }
        });
    });

    if (filter) {
        filter.addEventListener('input', applyFilter);
    }

    if (reset) {
        reset.addEventListener('click', showAllReferences);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

            if (!visible || pinnedRef !== null || (filter && filter.value.trim())) return;

            const target = visible.target;
            const currentSection = target.closest('.article-section') || target;
            sections.forEach((item) => item.classList.toggle('is-active', item === currentSection));
            evidenceBlocks.forEach((block) => block.classList.toggle('is-active-evidence', block === target));
            clearSelected();
            setActiveReferences(refsForTarget(target), labelForTarget(target));
        }, {
            rootMargin: '-24% 0px -56% 0px',
            threshold: 0.01,
        });

        observedTargets.forEach((target) => observer.observe(target));
    }

    const initialRef = window.location.hash.match(/^#ref-(\d+)$/)?.[1];
    if (initialRef) {
        selectReference(initialRef, false);
    } else {
        showAllReferences();
    }
};

initReferenceRail();
