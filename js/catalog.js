// --- ФАЙЛ: js/catalog.js ---
document.addEventListener('DOMContentLoaded', () => {
    if (!window.allMovies) {
        console.error('Данные о фильмах не загружены!');
        document.getElementById('movie-grid-container').innerHTML = '<p class="text-red-500">Ошибка загрузки данных.</p>';
        return;
    }

    const movies = window.allMovies;
    let filteredMovies = [...movies];

    const gridContainer = document.getElementById('movie-grid-container');
    const searchInput = document.getElementById('catalog-search-input');
    const genreFilter = document.getElementById('genre-filter');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');

    const yearMinSlider = document.getElementById('year-filter-min');
    const yearMaxSlider = document.getElementById('year-filter-max');
    const yearMinVal = document.getElementById('year-value-min');
    const yearMaxVal = document.getElementById('year-value-max');
    const yearRangeTrack = document.getElementById('year-range-track');

    const ratingMinSlider = document.getElementById('rating-filter-min');
    const ratingMaxSlider = document.getElementById('rating-filter-max');
    const ratingMinVal = document.getElementById('rating-value-min');
    const ratingMaxVal = document.getElementById('rating-value-max');
    const ratingRangeTrack = document.getElementById('rating-range-track');

    function setupRangeSlider(minSlider, maxSlider, minLabel, maxLabel, rangeTrack) {
        const update = (event) => {
            let min = parseFloat(minSlider.value);
            let max = parseFloat(maxSlider.value);
            if (min > max) {
                if (event && event.target === minSlider) {
                    maxSlider.value = min;
                    max = min;
                } else {
                    minSlider.value = max;
                    min = max;
                }
            }
            minLabel.textContent = minSlider.step === "0.1" ? min.toFixed(1) : min;
            maxLabel.textContent = maxSlider.step === "0.1" ? max.toFixed(1) : max;

            const minPercent = ((min - minSlider.min) / (minSlider.max - minSlider.min)) * 100;
            const maxPercent = ((max - maxSlider.min) / (maxSlider.max - minSlider.min)) * 100;
            rangeTrack.style.left = `${minPercent}%`;
            rangeTrack.style.right = `${100 - maxPercent}%`;
            if (event) applyFilters();
        };
        minSlider.addEventListener('input', update);
        maxSlider.addEventListener('input', update);
        return () => {
            minSlider.value = minSlider.min;
            maxSlider.value = maxSlider.max;
            update();
        };
    }

    const createMovieCard = (movie) => `
        <a href="movie-details.html?id=${movie.id}" class="movie-card bg-white">
            <img src="${movie.poster}" alt="${movie.title}" class="w-full h-auto aspect-[2/3] object-cover rounded-t-lg">
            <div class="p-3">
                <h3 class="font-bold text-md truncate">${movie.title}</h3>
                <p class="text-sm text-gray-500">${movie.year}</p>
            </div>
        </a>`;

    const renderMovies = () => {
        gridContainer.innerHTML = filteredMovies.length > 0
            ? filteredMovies.map(createMovieCard).join('')
            : '<p class="text-gray-500 col-span-full text-center">Фильмы не найдены.</p>';
    };

    const applyFilters = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = genreFilter.value;
        const minYear = parseInt(yearMinSlider.value, 10);
        const maxYear = parseInt(yearMaxSlider.value, 10);
        const minRating = parseFloat(ratingMinSlider.value);
        const maxRating = parseFloat(ratingMaxSlider.value);

        filteredMovies = movies.filter(movie =>
            (movie.title.toLowerCase().includes(searchTerm) || movie.originalTitle.toLowerCase().includes(searchTerm)) &&
            (!selectedGenre || movie.genre.includes(selectedGenre)) &&
            (movie.year >= minYear && movie.year <= maxYear) &&
            (movie.rating >= minRating && movie.rating <= maxRating)
        );
        renderMovies();
    };

    const resetYearSlider = setupRangeSlider(yearMinSlider, yearMaxSlider, yearMinVal, yearMaxVal, yearRangeTrack);
    const resetRatingSlider = setupRangeSlider(ratingMinSlider, ratingMaxSlider, ratingMinVal, ratingMaxVal, ratingRangeTrack);
    
    searchInput.addEventListener('input', applyFilters);
    genreFilter.addEventListener('change', applyFilters);
    
    resetFiltersBtn.addEventListener('click', () => {
        searchInput.value = '';
        genreFilter.value = '';
        resetYearSlider();
        resetRatingSlider();
        applyFilters();
    });

    applyFilters();
});