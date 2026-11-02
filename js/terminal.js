// Interactive DevOps / Developer CLI Terminal Simulator
class TerminalEmulator {
    constructor() {
        this.outputElem = document.getElementById('terminal-body');
        this.inputElem = document.getElementById('terminal-input');
        this.formElem = document.getElementById('terminal-form');
        this.history = [];
        this.historyIndex = -1;

        this.commands = {
            help: () => this.cmdHelp(),
            about: () => this.cmdAbout(),
            skills: () => this.cmdSkills(),
            experience: () => this.cmdExperience(),
            exp: () => this.cmdExperience(),
            projects: () => this.cmdProjects(),
            test: () => this.cmdTest(),
            'run test': () => this.cmdTest(),
            contact: () => this.cmdContact(),
            social: () => this.cmdSocial(),
            education: () => this.cmdEducation(),
            clear: () => this.cmdClear(),
            cls: () => this.cmdClear(),
            'sudo hire': () => this.cmdSudoHire(),
            sudo: (args) => this.cmdSudo(args),
            theme: (args) => this.cmdTheme(args),
            date: () => `<span class="text-terminal-cyan">${new Date().toString()}</span>`,
            whoami: () => `<span class="text-terminal-emerald font-semibold">guest@jagannath-portfolio (Privilege Level: Recruiter / Engineer)</span>`
        };

        this.availableCmds = ['help', 'about', 'skills', 'experience', 'projects', 'test', 'contact', 'social', 'education', 'clear', 'sudo hire', 'whoami', 'theme'];

        this.init();
    }

    init() {
        if (!this.inputElem || !this.formElem) return;

        this.formElem.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCommand(this.inputElem.value.trim());
        });

        this.inputElem.addEventListener('keydown', (e) => {
            if (window.soundManager) window.soundManager.playKeypress();

            // Arrow Up: history back
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (this.history.length > 0 && this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    this.inputElem.value = this.history[this.history.length - 1 - this.historyIndex];
                }
            } 
            // Arrow Down: history forward
            else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.inputElem.value = this.history[this.history.length - 1 - this.historyIndex];
                } else if (this.historyIndex === 0) {
                    this.historyIndex = -1;
                    this.inputElem.value = '';
                }
            }
            // Tab: auto-completion
            else if (e.key === 'Tab') {
                e.preventDefault();
                const val = this.inputElem.value.trim().toLowerCase();
                if (val) {
                    const match = this.availableCmds.find(c => c.startsWith(val));
                    if (match) {
                        this.inputElem.value = match;
                    }
                }
            }
        });

        // Click on terminal body focuses the input
        if (this.outputElem) {
            this.outputElem.parentElement.addEventListener('click', () => {
                this.inputElem.focus();
            });
        }
    }

    handleCommand(rawInput) {
        if (!rawInput) return;

        this.history.push(rawInput);
        this.historyIndex = -1;

        // Print entered line
        this.printLine(`<div class="flex items-center gap-2 text-slate-300 font-mono text-sm mt-2">
            <span class="text-emerald-400 font-bold">jagan@portfolio:~$</span>
            <span class="text-cyan-300 font-medium">${this.escapeHtml(rawInput)}</span>
        </div>`);

        const lower = rawInput.toLowerCase();
        const parts = lower.split(' ');
        const mainCmd = parts[0];
        const args = parts.slice(1);

        let output = '';

        if (lower === 'run test') {
            output = this.cmdTest();
        } else if (lower === 'sudo hire' || (parts[0] === 'sudo' && parts[1] === 'hire')) {
            output = this.cmdSudoHire();
        } else if (this.commands[mainCmd]) {
            output = this.commands[mainCmd](args);
        } else {
            output = `<div class="text-rose-400 text-sm font-mono mt-1">
                Command not found: "${this.escapeHtml(rawInput)}". Type <span class="text-cyan-400 font-semibold cursor-pointer underline" onclick="window.terminalInstance.quickExec('help')">help</span> to view available commands.
            </div>`;
        }

        if (output) {
            this.printLine(`<div class="font-mono text-sm leading-relaxed mt-1 mb-2">${output}</div>`);
        }

        this.inputElem.value = '';
        this.scrollToBottom();
    }

    quickExec(cmd) {
        this.inputElem.value = cmd;
        this.handleCommand(cmd);
    }

    printLine(html) {
        if (!this.outputElem) return;
        const div = document.createElement('div');
        div.innerHTML = html;
        this.outputElem.appendChild(div);
    }

    scrollToBottom() {
        if (this.outputElem) {
            const container = this.outputElem.parentElement;
            container.scrollTop = container.scrollHeight;
        }
    }

    escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    cmdHelp() {
        return `
        <div class="text-slate-300 space-y-1">
            <p class="text-cyan-400 font-bold mb-2">Available Shell Commands:</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div><span class="text-emerald-400 font-bold w-24 inline-block">about</span> : Summary & background profile</div>
                <div><span class="text-emerald-400 font-bold w-24 inline-block">skills</span> : Tech stack & test automation tools</div>
                <div><span class="text-emerald-400 font-bold w-24 inline-block">experience</span> : SDE & Automation work history</div>
                <div><span class="text-emerald-400 font-bold w-24 inline-block">projects</span> : Production & open-source projects</div>
                <div><span class="text-emerald-400 font-bold w-24 inline-block">test</span> : Launch live Playwright test runner demo</div>
                <div><span class="text-emerald-400 font-bold w-24 inline-block">contact</span> : Email, phone & direct reach-out</div>
                <div><span class="text-emerald-400 font-bold w-24 inline-block">social</span> : GitHub, LinkedIn, LeetCode, GFG</div>
                <div><span class="text-emerald-400 font-bold w-24 inline-block">education</span> : Degree & university background</div>
                <div><span class="text-emerald-400 font-bold w-24 inline-block">clear</span> : Clear current terminal buffer</div>
                <div><span class="text-purple-400 font-bold w-24 inline-block">sudo hire</span> : Direct fast-track hiring dispatch!</div>
            </div>
        </div>`;
    }

    cmdAbout() {
        return `
        <div class="text-slate-300 space-y-2">
            <p><span class="text-cyan-400 font-bold">Jagannath Behera</span> | SDET-II at Akamai Technologies (Ex-SDE-1 at Truminds)</p>
            <p class="text-slate-400 text-xs leading-5">
                B.Tech in Computer Science & Engineering from <span class="text-amber-300 font-semibold">NIT Rourkela</span> (June 2023).
                Over 3.2+ years of total experience across Edge Networking, Server Infrastructure, Internal Tooling,
                Python/Pytest test automation, Perforce/Git, and High-Throughput Backend Microservices.
            </p>
            <div class="flex flex-wrap gap-3 text-xs text-emerald-400 mt-2">
                <span>⚡ SDET-II @ Akamai Technologies</span>
                <span>⚡ 3.2+ Years Total Experience</span>
                <span>⚡ Edge Servers & Networking</span>
                <span>⚡ Python • Pytest • Perforce • Git</span>
            </div>
        </div>`;
    }

    cmdSkills() {
        return `
        <div class="text-slate-300 space-y-2">
            <div class="text-cyan-400 font-bold">Technical Matrix:</div>
            <div class="space-y-1 text-xs">
                <p><span class="text-slate-400 font-semibold">General Programming:</span> Python (Advanced Scripting), Java, C, C++, SQL, PHP, JavaScript</p>
                <p><span class="text-emerald-400 font-semibold">Test Automation & Frameworks:</span> Pytest, Playwright, Cypress, Appium, JMeter, Unittest, Postman</p>
                <p><span class="text-purple-400 font-semibold">Edge, Servers & Networking:</span> Edge Servers, CDN, Networking (TCP/IP, HTTP/2, DNS), Linux Server Admin</p>
                <p><span class="text-cyan-400 font-semibold">Version Control & Tooling:</span> Perforce (P4), Git / GitHub, Internal Tools Development</p>
                <p><span class="text-amber-400 font-semibold">Backend, DevOps & DBs:</span> Flask, Docker, Jenkins CI/CD, SonarQube, Elasticsearch, MongoDB, MySQL</p>
            </div>
        </div>`;
    }

    cmdExperience() {
        return `
        <div class="text-slate-300 space-y-3">
            <div>
                <p class="text-cyan-400 font-bold text-xs">[Aug 2026 – Present] SDET-II | Akamai Technologies</p>
                <ul class="list-disc list-inside text-xs text-slate-400 space-y-1 ml-2">
                    <li>Engineering automated test suites and internal automation tools using Python and Pytest.</li>
                    <li>Validating high-availability edge server infrastructure, proxy distribution, and enterprise networking protocols (TCP/IP, HTTP/2, DNS).</li>
                    <li>Managing large-scale enterprise codebases and branch workflows with Perforce (P4) and Git.</li>
                    <li>Architecting internal tooling to diagnose server latency, network anomalies, and distributed regression suites.</li>
                </ul>
            </div>
            <div>
                <p class="text-emerald-400 font-bold text-xs">[Aug 2023 – Aug 2026] SDE-1 | Truminds Software Systems, Bangalore</p>
                <ul class="list-disc list-inside text-xs text-slate-400 space-y-1 ml-2">
                    <li>Engineered Playwright automation framework with keyword-driven architecture for rapid CI regression.</li>
                    <li>Developed secure Flask APIs handling 10,000+ daily requests with MongoDB & Elasticsearch.</li>
                    <li>Integrated SonarQube quality gates improving code score by 25% and query latency by 30%.</li>
                </ul>
            </div>
            <div>
                <p class="text-purple-400 font-bold text-xs">[Mar 2023 – June 2023] SDE Intern | Truminds Software Systems, Gurgaon</p>
                <ul class="list-disc list-inside text-xs text-slate-400 space-y-1 ml-2">
                    <li>Automated web UI across multiple client portals with Cypress, boosting test speed by 30%.</li>
                    <li>Conducted API test coverage using Pytest & Postman with 95% accuracy.</li>
                </ul>
            </div>
            <div>
                <p class="text-amber-400 font-bold text-xs">[Sept 2021 – Nov 2021] Back-end Web Developer | Rajat Agrawal Creators</p>
                <ul class="list-disc list-inside text-xs text-slate-400 space-y-1 ml-2">
                    <li>Built authentication system with PHP/MySQL, increasing sign-ups by 20%.</li>
                    <li>Normalized DB schema, speeding up data queries by 40%.</li>
                </ul>
            </div>
        </div>`;
    }

    cmdProjects() {
        return `
        <div class="text-slate-300 space-y-2">
            <p class="text-cyan-400 font-bold">Featured Projects:</p>
            <div class="space-y-2 text-xs">
                <div class="border-l-2 border-cyan-400 pl-2">
                    <span class="text-white font-semibold">1. Vulnerability Scanner</span> (Flask, Bootstrap, MongoDB, Docker, Jenkins)
                    <p class="text-slate-400">Scans target IPs for open ports/services, validates TCP/HTTP protocols, flagged 100+ critical CVEs with automated CI/CD pipeline.</p>
                </div>
                <div class="border-l-2 border-emerald-400 pl-2">
                    <span class="text-white font-semibold">2. Enterprise Playwright Test Suite</span> (Python, Playwright, Allure, Jenkins)
                    <p class="text-slate-400">Scalable keyword-driven UI & API regression framework with parallel workers and auto-healing locators.</p>
                </div>
                <div class="border-l-2 border-purple-400 pl-2">
                    <span class="text-white font-semibold">3. E-Library For Engineers</span> (Android, Java, Firebase, XML)
                    <p class="text-slate-400">Study materials app for engineering undergraduates; reduced PDF retrieval latency by 40% via Firebase caching.</p>
                </div>
            </div>
        </div>`;
    }

    cmdTest() {
        if (window.testRunnerInstance) {
            window.testRunnerInstance.runSuite();
            return `<span class="text-emerald-400 font-bold">⚡ Spawning headless Chromium runner and executing live test suite above...</span>`;
        }
        return `<span class="text-cyan-400">Running simulated test suites... Check the Automation Lab section!</span>`;
    }

    cmdContact() {
        return `
        <div class="text-slate-300 space-y-1 text-xs">
            <p><span class="text-cyan-400 font-bold">Email:</span> <a href="mailto:jagannathbehera312@gmail.com" class="underline text-emerald-400">jagannathbehera312@gmail.com</a></p>
            <p><span class="text-cyan-400 font-bold">Phone:</span> <a href="tel:+916372939199" class="underline text-emerald-400">+91 6372939199</a></p>
            <p><span class="text-cyan-400 font-bold">Location:</span> Bangalore / Odisha, India (Open to Remote / Hybrid / On-site)</p>
        </div>`;
    }

    cmdSocial() {
        return `
        <div class="text-slate-300 space-y-1 text-xs">
            <p>• <span class="text-cyan-400 font-semibold">LinkedIn:</span> <a href="https://in.linkedin.com/in/jagannath-behera-5b4042196" target="_blank" class="underline text-blue-400">jagannath-behera-5b4042196</a></p>
            <p>• <span class="text-cyan-400 font-semibold">GitHub:</span> <a href="https://github.com/jagannathbehera312" target="_blank" class="underline text-purple-400">jagannathbehera312</a></p>
            <p>• <span class="text-cyan-400 font-semibold">LeetCode:</span> <a href="https://leetcode.com/u/Jagannath444/" target="_blank" class="underline text-amber-400">Jagannath444</a></p>
            <p>• <span class="text-cyan-400 font-semibold">GeeksforGeeks:</span> <a href="https://www.geeksforgeeks.org/profile/jagannathbehera312" target="_blank" class="underline text-emerald-400">jagannathbehera312</a></p>
        </div>`;
    }

    cmdEducation() {
        return `
        <div class="text-slate-300 text-xs">
            <p class="text-amber-300 font-bold text-sm">National Institute of Technology (NIT) Rourkela</p>
            <p class="text-slate-400">Bachelor of Technology (B.Tech) in Computer Science & Engineering</p>
            <p class="text-emerald-400">CGPA: 7.05 | Graduated: June 2023 | Rourkela, Odisha</p>
        </div>`;
    }

    cmdClear() {
        if (this.outputElem) {
            this.outputElem.innerHTML = '';
        }
        return '';
    }

    cmdSudo(args) {
        if (args && args[0] === 'hire') {
            return this.cmdSudoHire();
        }
        return `<span class="text-rose-400 text-xs">Permission denied: user "guest" is not in the sudoers file. Try 'sudo hire' for recruiter privileges.</span>`;
    }

    cmdSudoHire() {
        if (window.soundManager) window.soundManager.playSuccess();
        setTimeout(() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1200);

        return `
        <div class="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs space-y-1">
            <div class="font-bold text-sm text-emerald-400 flex items-center gap-2">
                🎉 [ELEVATED PRIVILEGES GRANTED]
            </div>
            <p>Welcome! Routing high-priority candidate profile directly to Jagannath Behera.</p>
            <p class="text-slate-300">Scrolling to direct contact channel & schedule modal...</p>
        </div>`;
    }

    cmdTheme(args) {
        const theme = args[0];
        const body = document.body;
        if (theme === 'matrix') {
            body.classList.remove('theme-cyberpunk');
            body.classList.add('theme-matrix');
            return `<span class="text-emerald-400">Theme switched to Matrix Green.</span>`;
        } else if (theme === 'cyberpunk') {
            body.classList.remove('theme-matrix');
            body.classList.add('theme-cyberpunk');
            return `<span class="text-purple-400">Theme switched to Cyberpunk Neon.</span>`;
        } else {
            body.classList.remove('theme-matrix', 'theme-cyberpunk');
            return `<span class="text-cyan-400">Theme reset to Default Quantum Slate. (Options: theme matrix | theme cyberpunk | theme default)</span>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.terminalInstance = new TerminalEmulator();
});
