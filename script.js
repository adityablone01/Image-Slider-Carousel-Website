// ================= SELECT ELEMENTS =================
const slider = document.querySelector('.slider');
const items = document.querySelectorAll('.slider .list .item');
const thumbnails = document.querySelectorAll('.thumbnail .item');
const next = document.getElementById('next');
const prev = document.getElementById('prev');

// ================= CONFIG =================
let countItem = items.length;
let itemActive = 0;
let autoSlideDelay = 5000;
let refreshInterval;

// ================= PROGRESS BAR =================
const progressBar = document.createElement('div');
progressBar.style.position = 'absolute';
progressBar.style.bottom = '0';
progressBar.style.left = '0';
progressBar.style.height = '4px';
progressBar.style.background = 'white';
progressBar.style.width = '0%';
progressBar.style.transition = `width ${autoSlideDelay}ms linear`;
slider.appendChild(progressBar);

// ================= FUNCTIONS =================

// Lazy load images
function lazyLoad(index){
    const img = items[index].querySelector('img');
    if(img && !img.getAttribute('src')){
        img.src = img.dataset.src;
    }
}

// Show slider
function showSlider(){
    const current = document.querySelector('.item.active');
    const currentThumb = document.querySelector('.thumbnail .item.active');

    if(current) current.classList.remove('active');
    if(currentThumb) currentThumb.classList.remove('active');

    items[itemActive].classList.add('active');
    thumbnails[itemActive].classList.add('active');

    lazyLoad(itemActive);
    setPositionThumbnail();

    resetAutoSlide();
}

// Next / Prev
function nextSlide(){
    itemActive = (itemActive + 1) % countItem;
    showSlider();
}

function prevSlide(){
    itemActive = (itemActive - 1 + countItem) % countItem;
    showSlider();
}

// Thumbnail scroll
function setPositionThumbnail(){
    const activeThumb = thumbnails[itemActive];
    const rect = activeThumb.getBoundingClientRect();

    if(rect.left < 0 || rect.right > window.innerWidth){
        activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
}

// Auto slide with progress bar
function startAutoSlide(){
    progressBar.style.width = '0%';

    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 50);

    refreshInterval = setInterval(nextSlide, autoSlideDelay);
}

function resetAutoSlide(){
    clearInterval(refreshInterval);
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    setTimeout(() => {
        progressBar.style.transition = `width ${autoSlideDelay}ms linear`;
        progressBar.style.width = '100%';
    }, 50);

    refreshInterval = setInterval(nextSlide, autoSlideDelay);
}

// ================= EVENTS =================

// Buttons
next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

// Thumbnail click
thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        itemActive = index;
        showSlider();
    });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight') nextSlide();
    if(e.key === 'ArrowLeft') prevSlide();
});

// Pause on hover
slider.addEventListener('mouseenter', () => clearInterval(refreshInterval));
slider.addEventListener('mouseleave', resetAutoSlide);

// ================= SWIPE SUPPORT =================
let startX = 0;

slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

slider.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;

    if(startX - endX > 50){
        nextSlide(); // swipe left
    }
    else if(endX - startX > 50){
        prevSlide(); // swipe right
    }
});

// ================= INIT =================
items.forEach((item, index) => {
    const img = item.querySelector('img');
    if(img){
        img.dataset.src = img.src;
        if(index !== 0) img.removeAttribute('src');
    }
});

lazyLoad(0);
startAutoSlide();
