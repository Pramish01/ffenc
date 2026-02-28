
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('off');
    }, 2400);
});


const cursor = document.getElementById('cur');
const cursorRing = document.getElementById('cur2');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

(function animateRing() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
})();

const interactives = 'a, button, .member-card, .feat-card, .transp-card, .pillar';
document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.width = '18px';
        cursor.style.height = '18px';
        cursorRing.style.width = '52px';
        cursorRing.style.height = '52px';
        cursorRing.style.borderColor = 'rgba(0,191,255,.8)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursorRing.style.width = '30px';
        cursorRing.style.height = '30px';
        cursorRing.style.borderColor = 'rgba(0,191,255,.5)';
    });
});


const heroCanvas = document.getElementById('heroCanvas');
const heroCtx = heroCanvas.getContext('2d');

function resizeHeroCanvas() {
    heroCanvas.width = heroCanvas.parentElement.offsetWidth;
    heroCanvas.height = heroCanvas.parentElement.offsetHeight;
}
resizeHeroCanvas();
window.addEventListener('resize', resizeHeroCanvas);

const heroParticles = Array.from({ length: 100 }, () => ({
    x: Math.random() * 3000,
    y: Math.random() * 900,
    vx: (Math.random() - 0.5) * 0.35,
    vy: -Math.random() * 0.45 - 0.05,
    r: Math.random() * 1.6 + 0.3,
    a: Math.random() * 0.8 + 0.1,
    blue: Math.random() > 0.4,
}));

let heroMouseX = 0, heroMouseY = 0;
document.addEventListener('mousemove', e => {
    heroMouseX = e.clientX;
    heroMouseY = e.clientY;
});

(function drawHeroParticles() {
    heroCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    heroParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -10) { p.y = heroCanvas.height + 10; p.x = Math.random() * heroCanvas.width; }
        if (p.x < -10) p.x = heroCanvas.width + 10;
        if (p.x > heroCanvas.width + 10) p.x = -10;

        heroCtx.beginPath();
        heroCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        heroCtx.fillStyle = p.blue
            ? `rgba(0,191,255,${p.a * 0.55})`
            : `rgba(204,0,0,${p.a * 0.65})`;
        heroCtx.fill();
    });

    const nearMouse = heroParticles.filter(p =>
        Math.hypot(p.x - heroMouseX, p.y - heroMouseY) < 120
    );
    nearMouse.forEach((p, i) => {
        nearMouse.slice(i + 1).forEach(p2 => {
            const d = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (d < 80) {
                heroCtx.beginPath();
                heroCtx.moveTo(p.x, p.y);
                heroCtx.lineTo(p2.x, p2.y);
                heroCtx.strokeStyle = `rgba(0,191,255,${0.15 * (1 - d / 80)})`;
                heroCtx.lineWidth = 0.5;
                heroCtx.stroke();
            }
        });
    });

    requestAnimationFrame(drawHeroParticles);
})();


const bgCanvas = document.getElementById('bgParticles');
const bgCtx = bgCanvas.getContext('2d');

bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
});

const bgParticles = Array.from({ length: 30 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    r: Math.random() * 0.8 + 0.2,
    a: Math.random() * 0.4 + 0.1,
}));

(function drawBgParticles() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    bgParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;

        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(0,191,255,${p.a * 0.3})`;
        bgCtx.fill();
    });

    requestAnimationFrame(drawBgParticles);
})();


const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('on');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.07 });

document.querySelectorAll('.rev, .rev-l, .rev-r, .rev-scale')
    .forEach(el => revealObserver.observe(el));


const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const num = parseInt(el.getAttribute('data-val'));
        const suf = el.getAttribute('data-suf') || '';
        if (isNaN(num)) return;

        let count = 0;
        const interval = setInterval(() => {
            count = Math.min(count + num / 60, num);
            el.textContent = Math.floor(count) + suf;
            if (count >= num) clearInterval(interval);
        }, 18);

        el.closest('.stat-block')?.classList.add('on');
        statObserver.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-n[data-val]')
    .forEach(el => statObserver.observe(el));


document.getElementById('hamburger').addEventListener('click', function () {
    const links = document.querySelector('.nav-links');
    const isOpen = links.style.display === 'flex';

    links.style.display = isOpen ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '70px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'rgba(0,0,0,.97)';
    links.style.padding = '20px 5%';
    links.style.borderBottom = '1px solid rgba(0,191,255,.2)';
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        const links = document.querySelector('.nav-links');
        links.style.display = 'none';
    });
});