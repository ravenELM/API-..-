// index.js for the glass UI

function openEndpoint(endpoint) {
    const baseUrl = window.location.origin;
    const url = baseUrl + endpoint;
    window.open(url, '_blank');
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.button-wrap button');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-4px) scale(1.02)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(0) scale(0.98)';
        });

        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-4px) scale(1.02)';
        });
    });
});
