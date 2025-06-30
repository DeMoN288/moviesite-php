// --- ФАЙЛ: js/profile.js (ОБНОВЛЕННАЯ ВЕРСИЯ С РЕДАКТИРОВАНИЕМ) ---

document.addEventListener('DOMContentLoaded', async () => {
    const user = await window.authReady;
    handleAuth(user);
});

function handleAuth(user) {
    const profileContent = document.getElementById('profile-content');
    const authPrompt = document.getElementById('auth-prompt');

    if (!profileContent || !authPrompt) {
        console.error('Не найдены основные блоки контента на странице профиля!');
        return;
    }

    if (user) {
        authPrompt.classList.add('hidden');
        profileContent.classList.remove('hidden');
        initProfilePage(user);
    } else {
        profileContent.classList.add('hidden');
        authPrompt.classList.remove('hidden');
    }
}

function initProfilePage(user) {
    document.getElementById('username-display').textContent = user.username;
    document.getElementById('user-id-display').textContent = `ID пользователя: ${user.id}`;
    document.getElementById('avatar-display').src = `https://i.pravatar.cc/120?u=${user.id}`;

    // Запускаем все функции страницы
    setupTabs();
    displayMoviesForList('favorites');
    
    // ↓↓↓ ДОБАВЛЯЕМ ОБРАБОТКУ ФОРМЫ СМЕНЫ ИМЕНИ ↓↓↓
    setupUsernameForm(user);
}

// ↓↓↓ НОВАЯ ФУНКЦИЯ ДЛЯ УПРАВЛЕНИЯ ФОРМОЙ ↓↓↓
function setupUsernameForm(currentUser) {
    const form = document.getElementById('change-username-form');
    const input = document.getElementById('new-username-input');
    const messageEl = document.getElementById('username-message');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageEl.textContent = '';
        messageEl.classList.remove('text-red-500', 'text-green-500');

        const newUsername = input.value.trim();

        if (newUsername === '') {
            messageEl.textContent = 'Имя пользователя не может быть пустым.';
            messageEl.classList.add('text-red-500');
            return;
        }

        if (newUsername === currentUser.username) {
            messageEl.textContent = 'Вы ввели свое текущее имя.';
            return;
        }

        const formData = new FormData();
        formData.append('newUsername', newUsername);

        try {
            const response = await fetch('api/api.php?action=changeUsername', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                messageEl.textContent = 'Имя успешно изменено!';
                messageEl.classList.add('text-green-500');
                showToast('Имя успешно изменено!', 'success');

                // Обновляем имя на странице без перезагрузки
                document.getElementById('username-display').textContent = result.newUsername;
                document.querySelector('#nav-profile-link span').textContent = result.newUsername;
                
                // Обновляем локальный объект пользователя
                window.currentUser.username = result.newUsername;
                currentUser.username = result.newUsername;

                input.value = ''; // Очищаем поле ввода
            } else {
                messageEl.textContent = result.message || 'Произошла ошибка.';
                messageEl.classList.add('text-red-500');
                showToast(result.message || 'Произошла ошибка.', 'error');
            }

        } catch (error) {
            console.error('Ошибка при смене имени:', error);
            messageEl.textContent = 'Ошибка соединения с сервером.';
            messageEl.classList.add('text-red-500');
        }
    });
}


function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('tab-active'));
            contents.forEach(c => c.classList.add('hidden'));
            tab.classList.add('tab-active');
            const listType = tab.dataset.list;
            document.getElementById(`content-${listType}`).classList.remove('hidden');
            displayMoviesForList(listType);
        });
    });
}

async function displayMoviesForList(listType) {
    const grid = document.querySelector(`#content-${listType} .grid`);
    if (!grid || grid.dataset.loaded === 'true') return;

    grid.innerHTML = '<p class="col-span-full text-gray-500">Загрузка фильмов...</p>';

    try {
        const response = await fetch(`api/api.php?action=getList&list=${listType}`);
        const data = await response.json();

        if (!data.success || data.list.length === 0) {
            grid.innerHTML = `<p class="col-span-full text-gray-500">Вы еще не добавили фильмы в этот список.</p>`;
            return;
        }

        const movieIds = data.list;
        const movies = window.allMovies.filter(movie => movieIds.includes(String(movie.id)));
        
        if (movies.length > 0) {
            grid.innerHTML = movies.map(movie => `
                <a href="movie-details.html?id=${movie.id}" class="movie-card bg-white">
                    <img src="${movie.poster}" alt="${movie.title}" class="w-full h-auto aspect-[2/3] object-cover rounded-t-lg">
                    <div class="p-3">
                        <h3 class="font-bold text-md truncate">${movie.title}</h3>
                        <p class="text-sm text-gray-500">${movie.year}</p>
                    </div>
                </a>
            `).join('');
            grid.dataset.loaded = 'true';
        } else {
            grid.innerHTML = '<p class="col-span-full text-gray-500">Не удалось найти информацию о фильмах в этом списке.</p>';
        }
    } catch (error) {
        console.error(`Ошибка загрузки списка ${listType}:`, error);
        grid.innerHTML = '<p class="col-span-full text-red-500">Ошибка загрузки данных.</p>';
    }
}