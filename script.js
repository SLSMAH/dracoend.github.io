const totalImages = 74; // <-- AHORA SON 74 IMÁGENES
const imageExtension = 'jpg';
const sliderImages = [];

for (let i = 1; i <= totalImages; i++) {
    sliderImages.push(`slider/${i}.${imageExtension}`);
}

console.log('📸 Intentando cargar', totalImages, 'imágenes:', sliderImages);

const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dotsContainer = document.querySelector('.dots-container');

let currentIndex = 0;
let autoplayInterval;

function loadSlider() {
    slider.innerHTML = '';
    let loaded = 0, failed = 0;

    sliderImages.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Imagen ${index + 1}`;

        img.onload = () => {
            loaded++;
            console.log(`✅ Cargada: ${src} (${loaded}/${totalImages})`);
        };

        img.onerror = function() {
            failed++;
            console.error(`❌ No se pudo cargar: ${src}`);
            this.style.background = '#cccccc';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.style.fontSize = '2rem';
            this.style.color = '#666';
            this.alt = `Imagen ${index + 1} no disponible`;
        };

        slider.appendChild(img);
    });

    sliderImages.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.index = idx;
        dotsContainer.appendChild(dot);
    });

    updateDots();

    setTimeout(() => {
        console.log(`📊 Resumen: ${loaded} cargadas, ${failed} fallidas`);
        if (loaded === 0) {
            console.error('🚨 Ninguna imagen se cargó. Verifica:');
            console.error('   - ¿La carpeta "slider" está en el mismo lugar que END.html?');
            console.error('   - ¿Los archivos se llaman 1.jpg, 2.jpg... exactamente?');
            console.error('   - ¿Las extensiones son .jpg minúsculas?');
        }
    }, 1000);
}

function updateSlider() {
    const slideWidth = slider.clientWidth;
    slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    updateDots();
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, idx) => {
        if (idx === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % sliderImages.length;
        updateSlider();
    }, 3000); // 3 segundos
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

nextBtn.addEventListener('click', () => {
    stopAutoplay();
    currentIndex = (currentIndex + 1) % sliderImages.length;
    updateSlider();
    startAutoplay();
});

prevBtn.addEventListener('click', () => {
    stopAutoplay();
    currentIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
    updateSlider();
    startAutoplay();
});

dotsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dot')) {
        stopAutoplay();
        currentIndex = parseInt(e.target.dataset.index);
        updateSlider();
        startAutoplay();
    }
});

slider.addEventListener('mouseenter', stopAutoplay);
slider.addEventListener('mouseleave', startAutoplay);
window.addEventListener('resize', updateSlider);

// ================= REPRODUCTOR MÚSICA =================
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

if (bgMusic) {
    bgMusic.volume = 0.3;
}

function playMusic() {
    if (bgMusic) {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                if (musicIcon) {
                    musicIcon.classList.remove('fa-play');
                    musicIcon.classList.add('fa-pause');
                }
                console.log('🎵 Música reproduciéndose');
            })
            .catch(e => console.log('⚠️ No se pudo reproducir automáticamente:', e));
    }
}

function pauseMusic() {
    if (bgMusic) {
        bgMusic.pause();
        isPlaying = false;
        if (musicIcon) {
            musicIcon.classList.remove('fa-pause');
            musicIcon.classList.add('fa-play');
        }
    }
}

if (musicToggle) {
    musicToggle.addEventListener('click', () => {
        if (isPlaying) pauseMusic();
        else playMusic();
    });
}

document.body.addEventListener('click', function initMusic() {
    playMusic();
    document.body.removeEventListener('click', initMusic);
}, { once: true });

window.addEventListener('scroll', function initMusicScroll() {
    playMusic();
    window.removeEventListener('scroll', initMusicScroll);
}, { once: true });

// ================= INICIAR =================
loadSlider();
updateSlider();
startAutoplay();