// --- ФАЙЛ: js/recommendations.js (ФИНАЛЬНАЯ ВЕРСИЯ) ---

document.addEventListener('DOMContentLoaded', async () => {
    // Ждем, пока auth.js проверит пользователя
    await new Promise(resolve => document.addEventListener('authChecked', resolve));
    
    // Если пользователь не вошел, перенаправляем на страницу входа
    if (!window.currentUser) {
        window.location.href = 'login.html';
        return;
    }

    generateRecommendations();
});

async function generateRecommendations() {
    const container = document.getElementById('recommended-grid-container');
    container.innerHTML = `<p class="col-span-full text-gray-500">Анализируем ваши предпочтения...</p>`;

    try {
        // Загружаем все необходимые данные параллельно
        const [favResponse, ratingsResponse] = await Promise.all([
            fetch(`api/api.php?action=getList&list=favorites`),
            fetch(`api/api.php?action=getList&list=ratings`) // Предполагаем, что можно получить все свои оценки
        ]);

        const favData = await favResponse.json();
        const ratingsData = await ratingsResponse.json();

        const favoriteIds = favData.list || [];
        const likedIds = [];

        // Собираем ID фильмов, которым пользователь поставил лайк
        if (ratingsData.success && ratingsData.ratings) {
            for (const movieId in ratingsData.ratings) {
                if (ratingsData.ratings[movieId].userVote === 'like') {
                    likedIds.push(movieId);
                }
            }
        }
        
        // Объединяем ID из избранного и лайков, чтобы получить полную картину предпочтений
        const preferenceIds = [...new Set([...favoriteIds, ...likedIds])];

        if (preferenceIds.length === 0) {
            // Сценарий 1: У пользователя нет предпочтений
            showPopularAsFallback(container);
            return;
        }

        // Сценарий 2: У пользователя есть предпочтения
        const allMovies = window.allMovies;
        const preferenceMovies = allMovies.filter(movie => preferenceIds.includes(String(movie.id)));

        // Собираем все жанры из предпочитаемых фильмов
        const favoriteGenres = new Set();
        preferenceMovies.forEach(movie => {
            if (Array.isArray(movie.genre)) {
                movie.genre.forEach(g => favoriteGenres.add(g));
            }
        });

        // Находим фильмы, которые пользователь еще не видел, но которые соответствуют его жанрам
        const recommendedMovies = allMovies
            .filter(movie => !preferenceIds.includes(String(movie.id))) // Исключаем уже добавленные/оцененные
            .map(movie => {
                // Считаем, сколько жанров фильма совпадает с любимыми жанрами пользователя
                const commonGenres = Array.isArray(movie.genre) ? movie.genre.filter(g => favoriteGenres.has(g)).length : 0;
                return { ...movie, score: commonGenres };
            })
            .filter(movie => movie.score > 0) // Оставляем только те, где есть хотя бы одно совпадение
            .sort((a, b) => b.score - a.score || b.rating - a.rating) // Сортируем по совпадениям, затем по рейтингу
            .slice(0, 18); // Берем топ-18

        if (recommendedMovies.length > 0) {
            container.innerHTML = recommendedMovies.map(createMovieCard).join('');
        } else {
            // Если ничего не нашлось, все равно показываем популярные
            showPopularAsFallback(container, "Не удалось найти новых рекомендаций. Посмотрите популярные фильмы!");
        }

    } catch (error) {
        console.error("Ошибка при генерации рекомендаций:", error);
        container.innerHTML = `<p class="col-span-full text-red-500">Не удалось загрузить рекомендации.</p>`;
    }
}

function showPopularAsFallback(container, message = "Добавьте фильмы в избранное или поставьте лайк, чтобы мы могли составить для вас рекомендации. А пока посмотрите популярные:") {
    const popularMovies = [...window.allMovies]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 12);
    
    container.innerHTML = `<p class="col-span-full text-gray-700 mb-4">${message}</p>` + popularMovies.map(createMovieCard).join('');
}

function createMovieCard(movie) {
    return `
        <a href="movie-details.html?id=${movie.id}" class="movie-card bg-white">
            <img src="${movie.poster}" alt="${movie.title}" class="w-full h-auto aspect-[2/3] object-cover rounded-t-lg">
            <div class="p-3">
                <h3 class="font-bold text-md truncate">${movie.title}</h3>
                <p class="text-sm text-gray-500">${movie.year}</p>
            </div>
        </a>
    `;
}