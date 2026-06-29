const initMatrixBackground = () => {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas || typeof canvas.getContext !== 'function') return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : { matches: false };

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

    if (!reduceMotion.matches) {
        window.addEventListener('scroll', () => {
            isScrolling = true;
            startAnimation();

            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => { isScrolling = false; }, 120);
        }, { passive: true });
    }

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
