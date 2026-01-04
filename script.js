const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Characters to use (Traditional Chinese + Bengali + Japanese + Greek/Math + Latin + Numerals)
// Note: We sample characters from these source texts (removing whitespace) to drive the rain.
const chineseSource = '《登鹳雀楼》王之涣';
const bengaliSource = 'চিত্ত যেথা ভয়শূন্য — রবীন্দ্রনাথ ঠাকুর';
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
        // Skip whitespace/newlines and common separators; keep punctuation like 《 》.
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

const drops = [];
// x below is the x coordinate
// 1 = y co-ordinate of the drop(same for every drop initially)
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

const draw = () => {
    // Light BG for the canvas (translucent to show trail)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        // Very subtle gray-on-white (mostly light gray, sometimes darker)
        ctx.fillStyle = Math.random() > 0.985 ? '#a8a8a8' : '#d8d8d8';

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Sending the drop back to the top randomly after it has crossed the screen
        // Adding a randomness to the reset to make the drops scattered on the Y axis
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Incrementing Y coordinate
        drops[i]++;
    }
};

// Loop the animation
setInterval(draw, 33);

// Handle window resize
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    
    // Recalculate columns
    const newColumns = Math.floor(width / fontSize);
    
    // If width increased, add new drops
    if (newColumns > columns) {
        for (let x = columns; x < newColumns; x++) {
            drops[x] = Math.random() * (height / fontSize); // Start at random height
        }
    }
    
    columns = newColumns;
});
