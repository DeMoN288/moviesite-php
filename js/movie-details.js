// --- ФАЙЛ: js/movie-details.js (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---

document.addEventListener('DOMContentLoaded', async () => {
    // --- ИСПРАВЛЕНИЕ 1: Ждем Promise, а не несуществующее событие ---
    // Это гарантирует, что мы получим данные о пользователе (window.currentUser)
    // перед тем, как продолжить.
    await window.authReady;
    
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    if (!movieId || !window.allMovies) {
        document.getElementById('movie-details-section').innerHTML = '<h1 class="text-2xl text-red-500">Ошибка: Фильм не найден или данные не загружены.</h1>';
        return;
    }

    // Загружаем всю информацию, специфичную для пользователя, параллельно
    const [ratings, favs, watched, planned] = await Promise.all([
        fetch(`api/api.php?action=getRatings&movieId=${movieId}`).then(res => res.json()),
        fetch(`api/api.php?action=getList&list=favorites`).then(res => res.json()),
        fetch(`api/api.php?action=getList&list=watched`).then(res => res.json()),
        fetch(`api/api.php?action=getList&list=planned`).then(res => res.json())
    ]);

    const userLists = {
        favorites: favs.list || [],
        watched: watched.list || [],
        planned: planned.list || []
    };

    // --- Инициализация страницы ---
    initMovieInfo(movieId);
    
    // Показываем кнопки "в избранное" и т.д. только если пользователь вошел
    if (window.currentUser) {
        document.getElementById('user-actions').classList.remove('hidden');
        initListButtons(movieId, userLists);
    }
    
    initRatingButtons(movieId, ratings);
});

/**
 * --- ИСПРАВЛЕНИЕ 2: Полностью заполненная функция ---
 * Находит фильм по ID и заполняет все поля на странице.
 * @param {string} movieId - ID фильма для отображения.
 */
function initMovieInfo(movieId) {
    const movie = window.allMovies.find(m => m.id === movieId);
    if (!movie) {
        document.getElementById('movie-details-section').innerHTML = '<h1 class="text-2xl text-red-500">Фильм не найден!</h1>';
        return;
    }

    // Заполняем все элементы на странице
    document.title = `${movie.title} | MovieSite`; // Обновляем заголовок вкладки
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-poster').src = movie.poster;
    document.getElementById('movie-poster').alt = movie.title;
    
    document.getElementById('movie-original-title').textContent = movie.originalTitle;
    document.getElementById('movie-year').textContent = movie.year;
    document.getElementById('movie-genre').textContent = movie.genre.join(', '); // Жанры - это массив, объединяем его в строку
    document.getElementById('movie-director').textContent = movie.director;
    document.getElementById('movie-duration').textContent = movie.duration;
    document.getElementById('movie-rating').textContent = movie.rating.toFixed(1); // Форматируем рейтинг до 1 знака после запятой
    document.getElementById('movie-description').textContent = movie.description;
}


// Эта часть кода у вас была правильной, оставляем ее без изменений.

function initListButtons(movieId, userLists) {
    const buttons = document.querySelectorAll('.list-btn');
    const textMap = {
        favorites: { add: 'Добавить в избранное', remove: 'Удалить из избранного' },
        watched: { add: 'Добавить в просмотренные', remove: 'Удалено из просмотренных' },
        planned: { add: 'Запланировать просмотр', remove: 'Удалено из планов' }
    };

    function updateButton(btn) {
        const listType = btn.dataset.list;
        const isInList = userLists[listType].includes(movieId);
        btn.querySelector('span').textContent = isInList ? textMap[listType].remove : textMap[listType].add;
        btn.classList.toggle('bg-secondary', isInList); // Используем цвет secondary для активных кнопок
        btn.classList.toggle('text-white', isInList);
    }

    buttons.forEach(btn => {
        updateButton(btn); // Изначальная настройка
        btn.addEventListener('click', async () => {
            const listType = btn.dataset.list;
            const formData = new FormData();
            formData.append('list', listType);
            formData.append('movieId', movieId);

            const response = await fetch('api/api.php?action=toggleList', { method: 'POST', body: formData }).then(res => res.json());
            if (response.success) {
                // Обновляем локальный кэш
                if (response.status === 'added') userLists[listType].push(movieId);
                else userLists[listType] = userLists[listType].filter(id => id !== movieId);
                updateButton(btn);
                showToast(response.status === 'added' ? 'Добавлено в список' : 'Удалено из списка', 'success');
            } else {
                showToast('Ошибка при обновлении списка', 'error');
            }
        });
    });
}

function initRatingButtons(movieId, initialRatings) {
    const ratingContainer = document.getElementById('rating-buttons');
    let currentVote = initialRatings.userVote;

    function updateRatingUI(ratings) {
        ratingContainer.querySelector('[data-count="likes"]').textContent = ratings.likes;
        ratingContainer.querySelector('[data-count="dislikes"]').textContent = ratings.dislikes;
        
        ratingContainer.querySelector('[data-vote="like"]').classList.toggle('bg-green-200', ratings.userVote === 'like');
        ratingContainer.querySelector('[data-vote="dislike"]').classList.toggle('bg-red-200', ratings.userVote === 'dislike');
    }
    
    updateRatingUI(initialRatings);

    if (!window.currentUser) {
        ratingContainer.querySelectorAll('button').forEach(b => b.disabled = true);
        document.getElementById('rating-auth-prompt').classList.remove('hidden');
        return;
    }

    ratingContainer.addEventListener('click', async (e) => {
        const button = e.target.closest('.rating-btn');
        if (!button || button.disabled) return;

        const voteType = button.dataset.vote;
        const formData = new FormData();
        formData.append('movieId', movieId);
        formData.append('vote', voteType);
        formData.append('currentVote', currentVote || '');

        const newRatings = await fetch('api/api.php?action=rateMovie', { method: 'POST', body: formData }).then(res => res.json());
        if (newRatings.success) {
            currentVote = newRatings.userVote;
            updateRatingUI(newRatings);
        } else {
            showToast('Ошибка при сохранении оценки', 'error');
        }
    });
}