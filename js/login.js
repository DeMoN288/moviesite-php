// --- ФАЙЛ: js/login.js ---
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = '';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showToast('Вход выполнен успешно! Перенаправляем...', 'success');
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1500);
            } else {
                errorMessage.textContent = result.message || 'Неверное имя пользователя или пароль.';
                showToast(result.message || 'Ошибка входа.', 'error');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            errorMessage.textContent = 'Не удалось связаться с сервером.';
            showToast('Не удалось связаться с сервером.', 'error');
        }
    });
});