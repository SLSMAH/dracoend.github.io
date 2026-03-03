// ================= CONFIG =================
const totalImages = 78; // Tienes hasta 78.jpg
const imageExtension = 'jpg';
const sliderImages = [];

// Generar lista de imágenes (SIN carpeta slider)
for (let i = 1; i <= totalImages; i++) {
    sliderImages.push(`${i}.${imageExtension}`);
}

console.log('📸 Intentando cargar', totalImages, 'imágenes:', sliderImages);

// ================= ELEMENTOS =================
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.dots-container');

let currentIndex = 0;
let autoplayInterval;

// ================= SLIDER =================
function loadSlider() {
    if (!slider) return;

    slider.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    sliderImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Imagen ${index + 1}`;
        slider.appendChild(img);

        if (dotsContainer) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = index;
            dotsContainer.appendChild(dot);
        }
    });

    updateDots();
}

function updateSlider() {
    if (!slider) return;

    const slideWidth = slider.clientWidth;
    slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    updateDots();
}

function updateDots() {
    if (!dotsContainer) return;

    document.querySelectorAll('.dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
    });
}

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % sliderImages.length;
        updateSlider();
    }, 3000);
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

// ================= EVENTOS =================
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        currentIndex = (currentIndex + 1) % sliderImages.length;
        updateSlider();
        startAutoplay();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
        updateSlider();
        startAutoplay();
    });
}

if (dotsContainer) {
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
            stopAutoplay();
            currentIndex = parseInt(e.target.dataset.index);
            updateSlider();
            startAutoplay();
        }
    });
}

if (slider) {
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
}

window.addEventListener('resize', updateSlider);

// ================= MÚSICA =================
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bgMusic');

let isPlaying = false;

if (bgMusic) {
    bgMusic.volume = 0.3;
}

function playMusic() {
    if (!bgMusic) return;

    bgMusic.play().then(() => {
        isPlaying = true;
        if (musicIcon) {
            musicIcon.classList.remove('fa-play');
            musicIcon.classList.add('fa-pause');
        }
    }).catch(() => {});
}

function pauseMusic() {
    if (!bgMusic) return;

    bgMusic.pause();
    isPlaying = false;

    if (musicIcon) {
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-play');
    }
}

if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        isPlaying ? pauseMusic() : playMusic();
    });
}

// Activar música al primer clic
document.body.addEventListener('click', function initMusic() {
    playMusic();
}, { once: true });

// ================= INICIAR =================
loadSlider();
updateSlider();
startAutoplay();