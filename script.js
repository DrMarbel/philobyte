/* --- GLOBAL LOGIC VARIABLES --- */
let simulationInterval = null;
let marketValue = 50; // Starting Price for Market Sim

/* --- GLOBAL FUNCTIONS --- */

function toggleTerminal() {
    let term = document.getElementById('terminal-modal');
    const isHidden = (term.style.display === 'none' || term.style.display === '');
    if (isHidden) {
        term.style.display = 'flex';
        const cmdInput = document.getElementById('cmd-input');
        if(cmdInput) cmdInput.focus();
    } else {
        term.style.display = 'none';
    }
}

// --- LOGIC LAB ENGINE ---
function runSimulation(type) {
    const canvas = document.getElementById('lab-canvas');
    const statusText = document.getElementById('lab-status');
    const marketBtns = document.getElementById('market-actions');
    const ctx = canvas.getContext('2d');

    // 1. Reset System
    if (simulationInterval) clearInterval(simulationInterval);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    marketBtns.style.display = 'none'; // Hide action buttons by default
    
    // 2. Load Cartridge
    switch(type) {
        case 'dungeon':
            statusText.innerText = "Running: Random Walk Algorithm...";
            startDungeonGen(ctx, canvas);
            break;
        case 'market':
            statusText.innerText = "Running: Elasticity Model...";
            marketBtns.style.display = 'block'; // Show Inject Button
            marketValue = canvas.height / 2; // Reset Price
            startMarketGen(ctx, canvas);
            break;
        case 'clear':
            statusText.innerText = "System Standby";
            break;
    }
}

// ALGORITHM 1: ENDGEON RANDOM WALKER
function startDungeonGen(ctx, canvas) {
    const cols = 60; const rows = 30; const size = 10;
    let x = cols / 2; let y = rows / 2;
    let steps = 0; const maxSteps = 300;

    // Draw Grid
    ctx.strokeStyle = '#111';
    for(let i=0; i<cols; i++) {
        for(let j=0; j<rows; j++) { ctx.strokeRect(i*size, j*size, size, size); }
    }

    simulationInterval = setInterval(() => {
        // Move Randomly (0:Up, 1:Right, 2:Down, 3:Left)
        const dir = Math.floor(Math.random() * 4);
        if (dir === 0) y--; else if (dir === 1) x++;
        else if (dir === 2) y++; else if (dir === 3) x--;

        // Bounds
        if(x < 1) x = 1; if(x > cols-2) x = cols-2;
        if(y < 1) y = 1; if(y > rows-2) y = rows-2;

        // Draw Floor & Cursor
        ctx.fillStyle = '#334155'; ctx.fillRect(x*size, y*size, size, size);
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(x*size, y*size, size, size);

        steps++;
        if (steps > maxSteps) clearInterval(simulationInterval);
    }, 20);
}

// ALGORITHM 2: INTERACTIVE MARKET (Supply/Demand)
function startMarketGen(ctx, canvas) {
    let x = 0;
    // Set line style
    ctx.strokeStyle = '#22c55e'; // Start Green (Growth)
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, marketValue);

    simulationInterval = setInterval(() => {
        x += 2; // Time moves forward
        
        // Natural Demand (Price goes UP slowly) + Random noise
        marketValue -= (0.5 + (Math.random() - 0.5) * 5);

        // Keep bounds
        if(marketValue < 10) marketValue = 10;
        if(marketValue > canvas.height - 10) marketValue = canvas.height - 10;

        // Color Logic: If price is low (high Y value), turn red
        if (marketValue > canvas.height * 0.8) ctx.strokeStyle = '#ef4444'; // Red
        else ctx.strokeStyle = '#22c55e'; // Green

        ctx.lineTo(x, marketValue);
        ctx.stroke();

        // Loop screen
        if (x > canvas.width) {
            x = 0;
            ctx.fillStyle = 'rgba(5,5,5,0.1)'; // Fade effect
            ctx.fillRect(0,0,canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(x, marketValue);
        }
    }, 30);
}

// ACTION: Player dumps supply -> Price Crashes (Value goes UP visually because Y=0 is top)
function marketCrash() {
    marketValue += 80; // Add to Y value (Drops the line visually)
}

/* --- PAGE LOAD LOGIC --- */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.fade-in-scroll');
    scrollElements.forEach(el => observer.observe(el));

    // 2. Terminal Input Logic
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('terminal-output');

    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                let cmd = this.value.toLowerCase().trim();
                let response = "";
                switch(cmd) {
                    case 'help': response = "Commands: projects, status, whoami, contact, clear"; break;
                    case 'projects': response = "Active: Endgeon Lite. Planning: Haunter, Trader, Instigate."; break;
                    case 'status': response = "System Optimal. Termux Environment: Stable."; break;
                    case 'whoami': response = "Philobyte // Lead Architect."; break;
                    case 'contact': response = "Signal valid. Send logs to: [contact@philobyte.dev]"; break;
                    case 'clear': 
                        output.innerHTML = '<p>Philobyte OS v1.0. Type "help" for commands.</p>';
                        const inputLine = document.querySelector('.input-line');
                        output.appendChild(inputLine);
                        this.value = ''; input.focus(); return; 
                    default: response = `Command not found: ${cmd}`;
                }
                let oldLine = document.createElement('div');
                oldLine.innerHTML = `<span style="color:#38bdf8">$ ${this.value}</span><br><span style="color:#e2e8f0">${response}</span><br><br>`;
                output.insertBefore(oldLine, document.querySelector('.input-line'));
                this.value = ''; output.scrollTop = output.scrollHeight;
            }
        });
    }
});