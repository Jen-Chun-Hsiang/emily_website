const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Characters to use (Katakana + Latin + Numerals)
const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nums = '0123456789';
const alphabet = katakana + latin + nums;

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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#e8e8e8'; // Light gray for the text
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        
        // Randomly vary the color slightly for depth
        // Mostly light gray, occasional darker highlight
        if (Math.random() > 0.98) {
             ctx.fillStyle = '#d0d0d0'; 
        } else {
             ctx.fillStyle = '#f0f0f0';
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
