const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Characters to use (Traditional Chinese + Bengali + Japanese + Greek/Math + Latin + Numerals)
// Note: We sample characters from these source texts (removing whitespace) to drive the rain.
const chineseSource = '白日依山尽，
黄河入海流。
欲穷千里目，
更上一层楼。
';
const bengaliSource = 'চিত্ত যেথা ভয়শূন্য, উচ্চ যেথা শির জ্ঞান যেথা মুক্ত, যেথা গৃহের প্রাচীর আপন প্রাঙ্গণতলে দিবসশর্বরী
বসুধারে রাখে নাই খণ্ড ক্ষুদ্র করি,
যেথা বাক্য হৃদয়ের উৎসমুখ হতে
উচ্ছ্বসিয়া উঠে, যেথা নির্বারিত স্রোতে
দেশে দেশে দিশে দিশে কর্মধারা ধায়
অজস্র সহস্রবিধ চরিতার্থতায়--
যেথা তুচ্ছ আচারের মরুবালুরাশি
বিচারের স্রোতঃপথ ফেলে নাই গ্রাসি,
পৌরুষেরে করে নি শতধা; নিত্য যেথা
তুমি সর্ব কর্ম চিন্তা আনন্দের নেতা--
নিজ হস্তে নির্দয় আঘাত করি, পিতঃ,
ভারতেরে সেই স্বর্গে করো জাগরিত।
';
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

// Extract unique characters from each source
const chineseChars = uniqueChars(chineseSource);
const bengaliChars = uniqueChars(bengaliSource);
const japaneseChars = uniqueChars(japaneseSource);
const greekMathChars = uniqueChars(greek + mathSymbols + latin + nums);

const alphabet = [...chineseChars, ...bengaliChars, ...japaneseChars, ...greekMathChars];

const fontSize = 16;
let columns = Math.floor(width / fontSize);

const drops = [];
// x below is the x coordinate
// 1 = y co-ordinate of the drop(same for every drop initially)
for (let x = 0; x < columns; x++) {
    drops[x] = 1;
}

const draw = () => {
    // Black BG for the canvas
    // Translucent BG to show trail
    ctx.fillStyle = 'rgba(18, 18, 18, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#4a4a4a'; // Darker gray for the text
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        
        // Randomly vary the color slightly for depth
        // Mostly gray, occasional white highlight
        if (Math.random() > 0.98) {
             ctx.fillStyle = '#ffffff'; 
        } else {
             ctx.fillStyle = '#555555';
        }

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
