// --- ФАЙЛ: js/main.js ---
document.addEventListener('DOMContentLoaded', () => {
    if (!window.allMovies) {
        console.error('Данные о фильмах не загружены!');
        return;
    }

    const movies = window.allMovies;
    const newMoviesContainer = document.getElementById('new-movies-container');
    const popularMoviesContainer = document.getElementById('popular-movies-container');
    const recommendedMoviesContainer = document.getElementById('recommended-movies-container');
    
    if (!newMoviesContainer || !popularMoviesContainer || !recommendedMoviesContainer) return;

    const createScrollingMovieCard = (movie) => `
        <div class="flex-shrink-0 w-48">
            <a href="movie-details.html?id=${movie.id}" class="movie-card h-full flex flex-col">
                <img src="${movie.poster}" alt="${movie.title}" class="w-full h-64 object-cover rounded-t-lg">
                <div class="p-3 flex-grow flex flex-col justify-between">
                    <h3 class="font-bold text-md truncate">${movie.title}</h3>
                    <p class="text-sm text-gray-500">${movie.year}</p>
                </div>
            </a>
        </div>`;

    const createGridMovieCard = (movie) => `
        <a href="movie-details.html?id=${movie.id}" class="movie-card">
            <img src="${movie.poster}" alt="${movie.title}" class="w-full h-auto aspect-[2/3] object-cover rounded-t-lg">
            <div class="p-3">
                <h3 class="font-bold text-md truncate">${movie.title}</h3>
                <p class="text-sm text-gray-500">${movie.year}</p>
            </div>
        </a>`;

    const newMovies = [...movies].sort((a, b) => b.year - a.year).slice(0, 8);
    newMoviesContainer.innerHTML = newMovies.map(createScrollingMovieCard).join('');

    const popularMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 12);
    popularMoviesContainer.innerHTML = popularMovies.map(createGridMovieCard).join('');

    const recommendedMovies = [...movies].sort(() => 0.5 - Math.random()).slice(0, 8);
    recommendedMoviesContainer.innerHTML = recommendedMovies.map(createScrollingMovieCard).join('');

    const setupScroller = (containerId, prevBtnId, nextBtnId) => {
        const container = document.getElementById(containerId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        if (!container || !prevBtn || !nextBtn) return;
        const scrollAmount = container.clientWidth * 0.8;
        prevBtn.addEventListener('click', () => container.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
        nextBtn.addEventListener('click', () => container.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
    };

    setupScroller('new-movies-container', 'prev-new', 'next-new');
    setupScroller('recommended-movies-container', 'prev-rec', 'next-rec');
});