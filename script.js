/* --- GLOBAL FUNCTIONS --- */

function toggleTerminal() {
    let term = document.getElementById('terminal-modal');
    // Check computed style or inline style
    const isHidden = (term.style.display === 'none' || term.style.display === '');
    
    if (isHidden) {
        term.style.display = 'flex';
        const cmdInput = document.getElementById('cmd-input');
        if(cmdInput) cmdInput.focus();
    } else {
        term.style.display = 'none';
    }
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
                        this.value = '';
                        input.focus();
                        return; 
                    default: response = `Command not found: ${cmd}`;
                }

                let oldLine = document.createElement('div');
                oldLine.innerHTML = `<span style="color:#38bdf8">$ ${this.value}</span><br><span style="color:#e2e8f0">${response}</span><br><br>`;
                output.insertBefore(oldLine, document.querySelector('.input-line'));
                this.value = '';
                output.scrollTop = output.scrollHeight;
            }
        });
    }
});