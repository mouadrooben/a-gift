// Game Variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    const wrapper = canvas.parentElement;
    canvas.width = wrapper.clientWidth;
    canvas.height = canvas.width * 0.75; // Maintain 4:3 aspect ratio
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Game State
let gameState = {
    score: 0,
    lives: 3,
    level: 1,
    isGameRunning: false,
    isGameOver: false,
    catX: canvas.width / 2,
    mouseX: canvas.width / 2,
    flowersCollected: 0,
};

// Cat Object
const cat = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    speed: 6,
};

// Flower Array
let flowers = [];

// Flower Colors and Points
const flowerTypes = [
    { color: '#9d4edd', points: 50, name: 'Purple' },
    { color: '#c77dff', points: 40, name: 'Light Purple' },
    { color: '#e0aaff', points: 30, name: 'Pink' },
    { color: '#ff006e', points: 35, name: 'Hot Pink' },
    { color: '#ffbe0b', points: 25, name: 'Yellow' },
    { color: '#fb5607', points: 25, name: 'Orange' },
    { color: '#3a86ff', points: 30, name: 'Blue' },
    { color: '#06ffa5', points: 25, name: 'Mint' },
];

// Input Handling
let keys = {};
let mousePos = { x: canvas.width / 2, y: 0 };
let touchActive = false;

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
});

// Touch Controls
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.touches[0].clientX - rect.left;
    touchActive = true;
}, { passive: false });

canvas.addEventListener('touchend', () => {
    touchActive = false;
});

// Mobile Button Controls
document.getElementById('leftBtn').addEventListener('touchstart', () => {
    keys['ArrowLeft'] = true;
});

document.getElementById('leftBtn').addEventListener('touchend', () => {
    keys['ArrowLeft'] = false;
});

document.getElementById('rightBtn').addEventListener('touchstart', () => {
    keys['ArrowRight'] = true;
});

document.getElementById('rightBtn').addEventListener('touchend', () => {
    keys['ArrowRight'] = false;
});

// Mouse button controls
document.getElementById('leftBtn').addEventListener('mousedown', () => {
    keys['ArrowLeft'] = true;
});

document.getElementById('leftBtn').addEventListener('mouseup', () => {
    keys['ArrowLeft'] = false;
});

document.getElementById('rightBtn').addEventListener('mousedown', () => {
    keys['ArrowRight'] = true;
});

document.getElementById('rightBtn').addEventListener('mouseup', () => {
    keys['ArrowRight'] = false;
});

// Update Cat Position
function updateCat() {
    // Keyboard controls
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        cat.x -= cat.speed;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        cat.x += cat.speed;
    }

    // Mouse/Touch controls
    if (touchActive || (mousePos.x && mousePos.x !== 0)) {
        const diff = mousePos.x - cat.x;
        if (Math.abs(diff) > 5) {
            cat.x += diff * 0.1;
        }
    }

    // Keep cat in bounds
    if (cat.x < cat.width / 2) cat.x = cat.width / 2;
    if (cat.x > canvas.width - cat.width / 2) cat.x = canvas.width - cat.width / 2;
}

// Draw Cat
function drawCat() {
    ctx.save();
    ctx.translate(cat.x, cat.y);

    // Cat body
    ctx.fillStyle = '#FF6B9D';
    ctx.beginPath();
    ctx.ellipse(0, 0, 25, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cat head
    ctx.fillStyle = '#FF6B9D';
    ctx.beginPath();
    ctx.arc(0, -15, 15, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    ctx.fillStyle = '#FF6B9D';
    ctx.beginPath();
    ctx.moveTo(-8, -28);
    ctx.lineTo(-12, -35);
    ctx.lineTo(-4, -25);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(8, -28);
    ctx.lineTo(12, -35);
    ctx.lineTo(4, -25);
    ctx.fill();

    // Inner ears
    ctx.fillStyle = '#FFB6D9';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.lineTo(-9, -31);
    ctx.lineTo(-3, -24);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(6, -26);
    ctx.lineTo(9, -31);
    ctx.lineTo(3, -24);
    ctx.fill();

    // Eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(-6, -17, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -17, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-6, -16, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(6, -16, 2, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.fillStyle = '#FF69B4';
    ctx.beginPath();
    ctx.arc(0, -10, 2, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(0, -5);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-3, -7, 2, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(3, -7, 2, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
}

// Create Flower
function createFlower() {
    const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
    flowers.push({
        x: Math.random() * (canvas.width - 30) + 15,
        y: -20,
        width: 20,
        height: 20,
        speed: 2 + (gameState.level * 0.5),
        color: flowerType.color,
        points: flowerType.points,
    });
}

// Update Flowers
function updateFlowers() {
    for (let i = flowers.length - 1; i >= 0; i--) {
        flowers[i].y += flowers[i].speed;

        // Check collision with cat
        if (
            flowers[i].x < cat.x + cat.width / 2 &&
            flowers[i].x + flowers[i].width > cat.x - cat.width / 2 &&
            flowers[i].y < cat.y + cat.height / 2 &&
            flowers[i].y + flowers[i].height > cat.y - cat.height / 2
        ) {
            gameState.score += flowers[i].points;
            gameState.flowersCollected++;
            flowers.splice(i, 1);
            createParticles(flowers[i]?.x || cat.x, flowers[i]?.y || cat.y, flowers[i]?.color || '#9d4edd');
        } else if (flowers[i].y > canvas.height) {
            // Flower missed
            gameState.lives--;
            flowers.splice(i, 1);

            if (gameState.lives <= 0) {
                endGame();
            }
        }
    }

    // Check level up
    const flowersForLevelUp = gameState.level * 10;
    if (gameState.flowersCollected >= flowersForLevelUp) {
        gameState.level++;
        gameState.flowersCollected = 0;
    }

    // Spawn new flowers
    if (Math.random() < 0.02 + (gameState.level * 0.005)) {
        createFlower();
    }
}

// Draw Flowers
function drawFlowers() {
    for (let flower of flowers) {
        ctx.save();
        ctx.translate(flower.x, flower.y);

        // Flower petals
        ctx.fillStyle = flower.color;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(
                Math.cos((i * Math.PI * 2) / 5) * 7,
                Math.sin((i * Math.PI * 2) / 5) * 7,
                6,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        // Flower center
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// Particles for collection feedback
let particles = [];

function createParticles(x, y, color) {
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            life: 30,
            color: color,
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;
        particles[i].vy += 0.1;
        particles[i].life--;

        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (let particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.life / 30;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Draw Score and Info on Canvas
function drawGameInfo() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(10, 10, 150, 100);

    ctx.fillStyle = '#9d4edd';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, 20, 50);
    ctx.fillText(`Level: ${gameState.level}`, 20, 70);
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lives').textContent = gameState.lives;
    document.getElementById('level').textContent = gameState.level;
}

// Game Loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = 'rgba(243, 213, 255, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState.isGameRunning && !gameState.isGameOver) {
        updateCat();
        updateFlowers();
        updateParticles();

        drawFlowers();
        drawParticles();
        drawCat();
        drawGameInfo();
        updateUI();
    }

    requestAnimationFrame(gameLoop);
}

// Start Game
function startGame() {
    document.getElementById('startModal').classList.add('hidden');
    gameState.isGameRunning = true;
    gameState.isGameOver = false;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.flowersCollected = 0;
    flowers = [];
    particles = [];
    gameLoop();
}

// End Game
function endGame() {
    gameState.isGameRunning = false;
    gameState.isGameOver = true;

    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalLevel').textContent = gameState.level;
    document.getElementById('gameOverModal').classList.remove('hidden');
}

// Initialize
window.addEventListener('load', () => {
    resizeCanvas();
    gameLoop();
});