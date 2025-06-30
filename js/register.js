// --- ФАЙЛ: js/register.js ---
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorMessage.textContent = '';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        try {
            const response = await fetch('api/register.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showToast('Регистрация прошла успешно!', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            } else {
                errorMessage.textContent = result.message || 'Произошла ошибка регистрации.';
                showToast(result.message || 'Ошибка регистрации.', 'error');
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            errorMessage.textContent = 'Не удалось связаться с сервером.';
            showToast('Не удалось связаться с сервером.', 'error');
        }
    });
});