// Main UI/UX Animations, Dynamic Typing, Project Filters & Modals
document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
    initCounters();
    initProjectFilters();
    initProjectModals();
    init3DTilt();
    initCursorAura();
    initNavigationSpy();
    initSoundToggle();
    initCopyButtons();
    initContactForm();
});

// 1. Dynamic Typing Effect for Hero Subtitle
function initTypingEffect() {
    const textElem = document.getElementById('typing-role');
    if (!textElem) return;

    const roles = [
        'SDET-II @ Akamai Technologies',
        'Edge Networking & Server Infrastructure QA',
        'Python & Pytest Automation Engineer',
        'Ex-SDE-1 @ Truminds Software Systems',
        'Distributed Systems & Networking Enthusiast',
        'NIT Rourkela Computer Science Alum'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentRole = roles[roleIdx];

        if (isDeleting) {
            textElem.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 40;
        } else {
            textElem.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            typingSpeed = 1800; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typingSpeed = 400; // Pause before typing new word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// 2. Animated Counter Numbers
function initCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    if (counters.length === 0) return;

    let hasRun = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasRun) {
                hasRun = true;
                counters.forEach(counter => {
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const suffix = counter.getAttribute('data-suffix') || '';
                    const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
                    const duration = 1800;
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease-out cubic
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const currentVal = target * easeOut;

                        counter.textContent = currentVal.toFixed(decimals) + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.textContent = target.toFixed(decimals) + suffix;
                        }
                    }

                    requestAnimationFrame(updateCount);
                });
            }
        });
    }, { threshold: 0.2 });

    const statsSection = document.getElementById('stats-strip');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// 3. Project Filter Tabs
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.soundManager) window.soundManager.playClick();
            
            filterBtns.forEach(b => {
                b.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
                b.classList.add('bg-slate-900/60', 'text-slate-400', 'border-slate-800');
            });
            btn.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/40');
            btn.classList.remove('bg-slate-900/60', 'text-slate-400', 'border-slate-800');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.97)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

// 4. Project Details Modal (Architecture deep-dive)
const projectData = {
    'vulnerability-scanner': {
        title: 'Network & Port Vulnerability Scanner',
        badge: 'Backend / Security / DevOps',
        description: 'Engineered a full-featured automated vulnerability detection system with Python Flask, Bootstrap, and MongoDB. Containerized with Docker for predictable CI/CD VPS deployments using automated Jenkins pipelines.',
        stats: [
            { label: 'CVEs Detected', val: '100+ Critical' },
            { label: 'Protocols Validated', val: 'TCP / HTTP / SSL' },
            { label: 'Deployment', val: 'Docker + Jenkins CI' }
        ],
        features: [
            'Automated asynchronous IP and open-port scanning with multi-socket discovery.',
            'Network protocol validation inspecting service signatures and misconfigured headers.',
            'Persistent MongoDB storage indexing scan reports with historical vulnerability trends.',
            'Continuous Jenkins integration pipeline running regression vulnerability checks on commits.'
        ],
        github: 'https://github.com/jagannathbehera312',
        demo: '#'
    },
    'playwright-framework': {
        title: 'Keyword-Driven Playwright Automation Suite',
        badge: 'Enterprise QA / SDET',
        description: 'Scalable multi-browser end-to-end testing platform built with Playwright and Python. Built for rapid CI regression, keyword-driven reusability, and comprehensive execution analytics.',
        stats: [
            { label: 'Speed Increase', val: '+40% Faster' },
            { label: 'Browser Coverage', val: 'Chromium / Firefox / WebKit' },
            { label: 'Parallelism', val: 'Multi-worker CI' }
        ],
        features: [
            'Keyword-driven abstraction layer decoupling test intent from fragile DOM selectors.',
            'Auto-waiting mechanisms and self-healing locators eliminating test flakiness.',
            'Rich HTML and trace viewer reports generated directly in Jenkins builds.',
            'Integrated API mock server simulating distributed microservices for isolated client testing.'
        ],
        github: 'https://github.com/jagannathbehera312',
        demo: '#'
    },
    'flask-mongodb-gateway': {
        title: 'High-Throughput Flask API Gateway & Caching',
        badge: 'Backend Engineering',
        description: 'Production-tested microservice backend designed for high concurrency, processing 10,000+ daily requests. Integrated with MongoDB replica sets, Elasticsearch caching, and SonarQube automated gates.',
        stats: [
            { label: 'Daily Throughput', val: '10,000+ Requests' },
            { label: 'Query Latency', val: '-30% Faster' },
            { label: 'Code Quality', val: '+25% SonarQube' }
        ],
        features: [
            'High-speed JWT and session authentication with rate-limiting middleware.',
            'Elasticsearch full-text search indexing with inverted index caching for sub-30ms queries.',
            'Automated SonarQube quality gates blocking code with smells or security vulnerabilities in CI.',
            'Normalized data schema design ensuring transactional consistency.'
        ],
        github: 'https://github.com/jagannathbehera312',
        demo: '#'
    },
    'elibrary-android': {
        title: 'E-Library For Engineers (Android Platform)',
        badge: 'Mobile & Cloud Systems',
        description: 'Comprehensive study materials mobile application serving engineering undergraduates across all semester disciplines. Powered by Java, XML, Firebase Realtime Database, and Chrome Custom Tabs.',
        stats: [
            { label: 'PDF Load Time', val: '-40% Latency' },
            { label: 'Target Audience', val: 'B.Tech Undergrads' },
            { label: 'Cloud Backend', val: 'Google Firebase' }
        ],
        features: [
            'Clean material design user interface organized by semester, branch, and syllabus.',
            'Integrated Google Firebase Storage for real-time PDF textbook retrieval and offline caching.',
            'Custom Tabs implementation delivering lightweight, secure in-app document previewing.',
            'Automated download manager with resumable background downloads.'
        ],
        github: 'https://github.com/jagannathbehera312',
        demo: '#'
    }
};

function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const triggerButtons = document.querySelectorAll('.open-project-modal');

    if (!modal) return;

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.soundManager) window.soundManager.playClick();
            const projectId = btn.getAttribute('data-project');
            const data = projectData[projectId];
            if (!data) return;

            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-badge').textContent = data.badge;
            document.getElementById('modal-desc').textContent = data.description;

            // Stats
            const statsContainer = document.getElementById('modal-stats');
            statsContainer.innerHTML = '';
            data.stats.forEach(s => {
                const item = document.createElement('div');
                item.className = 'p-3 rounded-lg bg-slate-900 border border-slate-800 text-center';
                item.innerHTML = `
                    <div class="text-cyan-400 font-bold text-base md:text-lg">${s.val}</div>
                    <div class="text-slate-400 text-xs mt-0.5">${s.label}</div>
                `;
                statsContainer.appendChild(item);
            });

            // Features
            const featContainer = document.getElementById('modal-features');
            featContainer.innerHTML = '';
            data.features.forEach(f => {
                const li = document.createElement('li');
                li.className = 'flex items-start gap-2 text-slate-300 text-xs md:text-sm';
                li.innerHTML = `<span class="text-emerald-400 mt-1">✓</span> <span>${f}</span>`;
                featContainer.appendChild(li);
            });

            document.getElementById('modal-github-link').href = data.github;

            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        if (window.soundManager) window.soundManager.playClick();
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    };

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// 5. 3D Card Tilt on Mouse Move
function init3DTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    if (window.innerWidth < 1024) return; // Only desktop

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// 6. Custom Mouse Cursor Glowing Aura
function initCursorAura() {
    const aura = document.getElementById('cursor-aura');
    if (!aura || window.innerWidth < 768) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderAura() {
        auraX += (mouseX - auraX) * 0.12;
        auraY += (mouseY - auraY) * 0.12;
        aura.style.transform = `translate3d(${auraX - 150}px, ${auraY - 150}px, 0)`;
        requestAnimationFrame(renderAura);
    }

    renderAura();
}

// 7. Active Navigation Spy
function initNavigationSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar && totalHeight > 0) {
            progressBar.style.width = `${(scrollY / totalHeight) * 100}%`;
        }

        sections.forEach(sec => {
            const top = sec.offsetTop - 140;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('text-cyan-400', 'font-semibold');
                    link.classList.add('text-slate-400');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('text-cyan-400', 'font-semibold');
                        link.classList.remove('text-slate-400');
                    }
                });
            }
        });
    });
}

// 8. Sound Toggle
function initSoundToggle() {
    const btn = document.getElementById('sound-toggle-btn');
    const icon = document.getElementById('sound-icon');
    const statusText = document.getElementById('sound-status');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const isMuted = !window.soundManager.toggle();
        if (isMuted) {
            if (icon) icon.innerHTML = '🔇';
            if (statusText) statusText.textContent = 'Muted';
            showToast('UI Sound Effects: Off');
        } else {
            if (icon) icon.innerHTML = '🔊';
            if (statusText) statusText.textContent = 'Audio On';
            showToast('UI Sound Effects: Enabled 🔊');
        }
    });
}

// 9. Quick Copy to Clipboard Buttons with Toast
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-trigger');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.soundManager) window.soundManager.playClick();
            const textToCopy = btn.getAttribute('data-copy');
            const label = btn.getAttribute('data-label') || 'Copied';

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`✓ Copied ${label} to clipboard!`);
                if (window.soundManager) window.soundManager.playSuccess();
            }).catch(() => {
                showToast(`Press Ctrl+C to copy: ${textToCopy}`);
            });
        });
    });
}

// Toast notification function
window.showToast = function(msg) {
    let toast = document.getElementById('ui-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'ui-toast';
        toast.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 text-cyan-300 text-xs md:text-sm font-mono shadow-2xl backdrop-blur-md transform transition-all duration-300 translate-y-10 opacity-0 pointer-events-none';
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
    toast.classList.remove('translate-y-10', 'opacity-0', 'pointer-events-none');
    toast.classList.add('translate-y-0', 'opacity-100');

    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0', 'pointer-events-none');
        toast.classList.remove('translate-y-0', 'opacity-100');
    }, 2800);
};

// 10. Contact Form Submission simulation
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const name = form.querySelector('#sender-name').value;
        const email = form.querySelector('#sender-email').value;
        const msg = form.querySelector('#sender-message').value;

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="animate-spin mr-2">⟳</span> Dispatching Message...`;
        }

        setTimeout(() => {
            if (window.soundManager) window.soundManager.playSuccess();
            showToast(`Thank you ${name}! Direct dispatch logged.`);
            
            // Generate mailto link as fallback
            const mailtoUrl = `mailto:jagannathbehera312@gmail.com?subject=Contact%20from%20Portfolio%20(${encodeURIComponent(name)})&body=${encodeURIComponent(msg + '\n\nFrom: ' + email)}`;
            window.open(mailtoUrl, '_blank');

            form.reset();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>✓</span> Message Sent Successfully!`;
                setTimeout(() => {
                    submitBtn.innerHTML = `<span>🚀</span> Send Priority Message`;
                }, 3000);
            }
        }, 800);
    });
}
