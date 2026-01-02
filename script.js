// script.js

function openEndpoint(endpoint) {
    const baseUrl = 'https://apfel-api-nova.onrender.com';
    const url = baseUrl + endpoint;
    window.open(url, '_blank');
}

// Auth functionality
const joinUsBtn = document.getElementById('joinUsBtn');
const loginModal = document.getElementById('loginModal');
const authForm = document.getElementById('authForm');
const profileImg = document.getElementById('profileImg');
const modalTitle = document.getElementById('modalTitle');
const submitBtn = document.getElementById('submitBtn');

// Check if logged in on page load
async function checkLogin() {
    try {
        const response = await fetch('/profile');
        if (response.ok) {
            joinUsBtn.style.display = 'none';
            profileImg.style.display = 'block';
            document.getElementById('apiTester').style.display = 'block';
        }
    } catch (error) {
        // Not logged in
    }
}

checkLogin();

joinUsBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
});

document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.style.display = 'none';
        clearErrors();
    });
});

document.querySelectorAll('input[name="authType"]').forEach(radio => {
    radio.addEventListener('change', () => {
        modalTitle.textContent = radio.value === 'login' ? 'Login' : 'Sign Up';
        submitBtn.textContent = radio.value === 'login' ? 'Login' : 'Sign Up';
    });
});

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const authType = document.querySelector('input[name="authType"]:checked').value;

    let valid = true;

    if (!email) {
        document.getElementById('emailError').textContent = 'Email is required';
        valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        document.getElementById('emailError').textContent = 'Invalid email format';
        valid = false;
    }

    if (!password) {
        document.getElementById('passwordError').textContent = 'Password is required';
        valid = false;
    } else if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
        valid = false;
    }

    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    try {
        const endpoint = authType === 'login' ? '/login' : '/register';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        document.getElementById('authMessage').textContent = data.message || data.error;
        document.getElementById('authMessage').style.color = response.ok ? 'green' : 'red';
        if (response.ok) {
            setTimeout(() => {
                loginModal.style.display = 'none';
                showProfile(data.apiKey);
            }, 1000);
        }
    } catch (error) {
        document.getElementById('authMessage').textContent = 'Network error. Please try again.';
        document.getElementById('authMessage').style.color = 'red';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = authType === 'login' ? 'Login' : 'Sign Up';
    }
});

function clearErrors() {
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('authMessage').textContent = '';
}

function showProfile(apiKey) {
    joinUsBtn.style.display = 'none';
    profileImg.style.display = 'block';
}

profileImg.addEventListener('click', () => {
    window.location = '/user';
});

document.getElementById('testApiBtn').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKeyInput').value;
    const endpoint = document.getElementById('endpointInput').value;
    if (apiKey && endpoint) {
        const url = `${baseUrl}${endpoint}?api_key=${apiKey}`;
        window.open(url, '_blank');
    } else {
        alert('Please enter API key and endpoint');
    }
});

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