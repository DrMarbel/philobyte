/* --- GLOBAL LOGIC VARIABLES --- */
let simulationInterval = null;
let marketValue = 50;
let terminalState = 'SHELL'; // SHELL, UPLINK_MSG, UPLINK_CONFIRM
let uplinkPayload = ""; // Stores the message while waiting for confirmation

/* --- GLOBAL VARIABLES --- */
const usr = "martinbelt753";
const dmain = "@gmail";
const dot = ".com";

/* --- GLOBAL FUNCTIONS --- */

function toggleTerminal() {
    let term = document.getElementById('terminal-modal');
    const isHidden = (term.style.display === 'none' || term.style.display === '');
    
    if (isHidden) {
        term.style.display = 'flex';
        setTimeout(() => {
            const cmdInput = document.getElementById('cmd-input');
            if(cmdInput) cmdInput.focus();
        }, 50);
    } else {
        term.style.display = 'none';
    }
}

function forceFocus() {
    if (document.activeElement.tagName !== 'A') {
        const cmdInput = document.getElementById('cmd-input');
        if(cmdInput) cmdInput.focus();
    }
}

function initiateContact() {
    let term = document.getElementById('terminal-modal');
    term.style.display = 'flex';
    const logs = document.getElementById('terminal-logs');
    const input = document.getElementById('cmd-input');
    
    logs.innerHTML = ''; 
    writeLine("INITIALIZING SECURE UPLINK...", "#ef4444");
    writeLine("ESTABLISHING ENCRYPTED TUNNEL...", "#ef4444");
    
    setTimeout(() => {
        writeLine("CONNECTION ESTABLISHED.", "#22c55e");
        writeLine("ENTER TRANSMISSION MESSAGE:", "#fff");
        terminalState = 'UPLINK_MSG'; // Set state to wait for message
        document.getElementById('term-prompt').innerText = ">";
        input.focus(); 
    }, 800);
}

function writeLine(text, color = "#e2e8f0") {
    const logs = document.getElementById('terminal-logs');
    const line = document.createElement('div');
    line.style.color = color;
    line.innerHTML = text;
    logs.appendChild(line);
    
    const body = document.getElementById('terminal-body');
    body.scrollTop = body.scrollHeight;
    
    return line;
}

// --- LOGIC LAB ENGINE ---
function runSimulation(type) {
    const canvas = document.getElementById('lab-canvas');
    const statusText = document.getElementById('lab-status');
    const marketBtns = document.getElementById('market-actions');
    const ctx = canvas.getContext('2d');

    if (simulationInterval) clearInterval(simulationInterval);
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    marketBtns.style.display = 'none';
    
    switch(type) {
        case 'dungeon':
            statusText.innerText = "Running: Random Walk Algorithm...";
            startDungeonGen(ctx, canvas);
            break;
        case 'market':
            statusText.innerText = "Running: Elasticity Model...";
            marketBtns.style.display = 'block';
            marketValue = canvas.height / 2;
            startMarketGen(ctx, canvas);
            break;
        case 'clear':
            statusText.innerText = "System Standby";
            break;
    }
}

function startDungeonGen(ctx, canvas) {
    const cols = 60; const rows = 30; const size = 10;
    let x = cols / 2; let y = rows / 2;
    let steps = 0; const maxSteps = 300;
    ctx.strokeStyle = '#111';
    for(let i=0; i<cols; i++) {
        for(let j=0; j<rows; j++) { ctx.strokeRect(i*size, j*size, size, size); }
    }
    simulationInterval = setInterval(() => {
        const dir = Math.floor(Math.random() * 4);
        if (dir === 0) y--; else if (dir === 1) x++;
        else if (dir === 2) y++; else if (dir === 3) x--;
        if(x < 1) x = 1; if(x > cols-2) x = cols-2;
        if(y < 1) y = 1; if(y > rows-2) y = rows-2;
        ctx.fillStyle = '#334155'; ctx.fillRect(x*size, y*size, size, size);
        ctx.fillStyle = '#38bdf8'; ctx.fillRect(x*size, y*size, size, size);
        steps++;
        if (steps > maxSteps) clearInterval(simulationInterval);
    }, 20);
}

function startMarketGen(ctx, canvas) {
    let x = 0;
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, marketValue);
    simulationInterval = setInterval(() => {
        x += 2;
        marketValue -= (0.5 + (Math.random() - 0.5) * 5);
        if(marketValue < 10) marketValue = 10;
        if(marketValue > canvas.height - 10) marketValue = canvas.height - 10;
        if (marketValue > canvas.height * 0.8) ctx.strokeStyle = '#ef4444'; 
        else ctx.strokeStyle = '#22c55e';
        ctx.lineTo(x, marketValue); ctx.stroke();
        if (x > canvas.width) {
            x = 0; ctx.fillStyle = 'rgba(5,5,5,0.1)'; ctx.fillRect(0,0,canvas.width, canvas.height);
            ctx.beginPath(); ctx.moveTo(x, marketValue);
        }
    }, 30);
}

function marketCrash() { marketValue += 80; }

/* --- PAGE LOAD LOGIC --- */
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);
    document.querySelectorAll('.fade-in-scroll').forEach(el => observer.observe(el));

    const input = document.getElementById('cmd-input');
    const logs = document.getElementById('terminal-logs');

    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                let cmd = this.value.trim();
                if (cmd === "") return;

                // --- STATE 0: SHELL ---
                if (terminalState === 'SHELL') {
                    writeLine(`$ ${cmd}`, "#38bdf8");
                    let response = "";
                    switch(cmd.toLowerCase()) {
                        case 'help': response = "Commands: projects, status, uplink, clear"; break;
                        case 'projects': response = "Active: Endgeon Lite, Philobit. Planning: Haunter, Trader, Instigate."; break;
                        case 'status': response = "System Optimal. Terminal Environment: Stable."; break;
                        case 'uplink': 
                            initiateContact(); 
                            this.value = ''; 
                            return; 
                        case 'clear': 
                            logs.innerHTML = '<p>Philobyte OS v0.0.1. Type "help" for commands.</p>';
                            this.value = ''; return; 
                        default: response = `Command not found: ${cmd}`;
                    }
                    writeLine(response);
                
                // --- STATE 1: UPLINK MESSAGE ENTRY ---
                } else if (terminalState === 'UPLINK_MSG') {
                    writeLine(`> ${cmd}`, "#38bdf8");
                    uplinkPayload = cmd; // Store the message
                    
                    let processingLine = writeLine("ENCRYPTING: [....................]", "#ef4444");
                    
                    let dots = 0;
                    let scrambleInterval = setInterval(() => {
                        dots++;
                        let bar = "[" + "#".repeat(dots) + ".".repeat(20-dots) + "]";
                        let hex = Math.random().toString(16).substr(2, 8).toUpperCase();
                        processingLine.innerText = `ENCRYPTING: ${bar} 0x${hex}`;
                        
                        if (dots >= 20) {
                            clearInterval(scrambleInterval);
                            processingLine.innerText = "PACKET ENCRYPTED. READY.";
                            processingLine.style.color = "#22c55e";
                            
                            // Transition to Confirmation State
                            setTimeout(() => {
                                writeLine("CONFIRM TRANSMISSION? (Y/N)", "#fff");
                                terminalState = 'UPLINK_CONFIRM';
                                document.getElementById('term-prompt').innerText = "?";
                            }, 200);
                        }
                    }, 30); // Fast encryption animation
                
                // --- STATE 2: UPLINK CONFIRMATION (Y/N) ---
                } else if (terminalState === 'UPLINK_CONFIRM') {
                    writeLine(`? ${cmd}`, "#38bdf8");
                    
                    if (cmd.toLowerCase() === 'y' || cmd.toLowerCase() === 'yes') {
                        writeLine("EXECUTING UPLINK...", "#22c55e");
                        
                        // Copy to Clipboard Backup
                        navigator.clipboard.writeText(uplinkPayload).catch(err => console.log(err));

                        // DIRECT LAUNCH
                        // Since this is triggered by the 'Enter' key press on 'Y',
                        // The browser allows this navigation instantly.
                        window.location.href = `mailto:${usr}${dmain}${dot}?subject=Secure Uplink&body=${encodeURIComponent(uplinkPayload)}`;
                        
                        setTimeout(() => {
                            writeLine("SESSION TERMINATED.", "#text-muted");
                            terminalState = 'SHELL';
                            document.getElementById('term-prompt').innerText = "$";
                        }, 1000);

                    } else {
                        writeLine("TRANSMISSION ABORTED.", "#ef4444");
                        setTimeout(() => {
                            terminalState = 'SHELL';
                            document.getElementById('term-prompt').innerText = "$";
                        }, 500);
                    }
                }
                
                this.value = '';
                // Ensure keyboard stays up
                setTimeout(() => input.focus(), 10);
            }
        });
    }
});