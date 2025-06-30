// --- ФАЙЛ: js/auth.js (ВОЗВРАЩЕНА ПРОСТАЯ ВЕРСИЯ) ---
window.currentUser = null;

window.authReady = new Promise(async (resolve) => {
    try {
        const response = await fetch('api/auth_check.php');
        const data = await response.json();
        
        const navGuest = document.getElementById('nav-guest');
        const navUser = document.getElementById('nav-user');
        
        if (data.loggedIn && data.user) {
            window.currentUser = data.user;
            navGuest.style.display = 'none';
            navUser.style.display = 'flex';
            
            const profileLinkSpan = document.querySelector('#nav-profile-link span');
            if (profileLinkSpan) profileLinkSpan.textContent = data.user.username;
        } else {
            window.currentUser = null;
            navGuest.style.display = 'flex';
            navUser.style.display = 'none';
        }
    } catch (error) {
        console.error('Ошибка проверки статуса аутентификации:', error);
        window.currentUser = null;
        document.getElementById('nav-guest').style.display = 'flex';
        document.getElementById('nav-user').style.display = 'none';
    }
    
    resolve(window.currentUser);
});

async function logout() {
    await fetch('api/logout.php');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    window.authReady.then(() => {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    });
});