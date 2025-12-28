// script.js

function openEndpoint(endpoint) {
    const baseUrl = 'https://apfel-api-raven.vercel.app';
    const url = baseUrl + endpoint;
    window.open(url, '_blank');
}

// Music player
const disc = document.querySelector('.disc');
const audio = document.getElementById('music');

disc.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        disc.classList.add('playing');
    } else {
        audio.pause();
        disc.classList.remove('playing');
    }
});