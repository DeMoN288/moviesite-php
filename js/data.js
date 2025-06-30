// --- ФАЙЛ: js/data.js  ---

const movieDBData = {
    "1": { title: "Дюна", originalTitle: "Dune", poster: "img/Dune.webp", rating: 8.7, year: 2021, genre: ["Фантастика", "Приключения", "Драма"], description: "Наследник знаменитого дома Атрейдесов Пол отправляется вместе с семьей на одну из самых опасных планет во Вселенной — Арракис.", director: "Дени Вильнёв", duration: "155 мин." },
    "2": { title: "Оппенгеймер", originalTitle: "Oppenheimer", poster: "img/Oppenheimer.jpg", rating: 8.5, year: 2023, genre: ["Драма", "Биография", "Исторический"], description: "История жизни американского физика-теоретика Роберта Оппенгеймера, который во время Второй мировой войны руководил Манхэттенским проектом.", director: "Кристофер Нолан", duration: "180 мин." },
    "3": { title: "Барби", originalTitle: "Barbie", poster: "img/Barbie.jpg", rating: 7.2, year: 2023, genre: ["Комедия", "Фэнтези", "Приключения"], description: "Барби живёт в идеальном мире, где всё прекрасно, но однажды она начинает задаваться вопросами о реальности.", director: "Грета Гервиг", duration: "114 мин." },
    "4": { title: "Дюна: Часть вторая", originalTitle: "Dune: Part Two", poster: "img/Dune2.jpg", rating: 8.6, year: 2024, genre: ["Фантастика", "Приключения", "Боевик"], description: "Пол Атрейдес объединяется с Чани и фрименами, чтобы отомстить тем, кто уничтожил его семью.", director: "Дени Вильнёв", duration: "166 мин." },
    "5": { title: "Фуриоса: Хроники Безумного Макса", originalTitle: "Furiosa: A Mad Max Saga", poster: "img/FuriosaA Mad Max Saga.jpg", rating: 7.9, year: 2024, genre: ["Боевик", "Фантастика", "Приключения"], description: "История происхождения воительницы Фуриосы до встречи с Максом Рокатански.", director: "Джордж Миллер", duration: "148 мин." },
    "6": { title: "Каскадеры", originalTitle: "The Fall Guy", poster: "img/The Fall Guy.jpg", rating: 7.3, year: 2024, genre: ["Боевик", "Комедия", "Триллер"], description: "Ветеран-каскадер Колт Сиверс получает последнее задание: найти пропавшую звезду фильма.", director: "Дэвид Литч", duration: "126 мин." },
    "7": { title: "Планета обезьян: Новое царство", originalTitle: "Kingdom of the Planet of the Apes", poster: "img/Kingdom of the Planet of the Apes.jpg", rating: 7.5, year: 2024, genre: ["Фантастика", "Боевик", "Приключения"], description: "Прошли десятилетия после правления Цезаря. Появляется новый тиран, который строит свою империю.", director: "Уэс Болл", duration: "145 мин." },
    "8": { title: "Падение империи", originalTitle: "Civil War", poster: "img/Civil War.jpg", rating: 7.1, year: 2024, genre: ["Триллер", "Боевик", "Драма"], description: "В недалеком будущем группа журналистов путешествует по стране, пытаясь запечатлеть раздирающий страну конфликт.", director: "Алекс Гарленд", duration: "109 мин." },
    "9": { title: "Чужой: Завет", originalTitle: "Alien: Covenant", poster: "img/AlienCovenant.jpg", rating: 6.4, year: 2017, genre: ["Ужасы", "Фантастика"], description: "Экипаж колониального корабля «Завет» находит, как им кажется, неизведанный рай, но обнаруживает темный и опасный мир.", director: "Ридли Скотт", duration: "122 мин." },
    "10": { title: "Заклятие", originalTitle: "The Conjuring", poster: "img/The Conjuring.jpg", rating: 7.5, year: 2013, genre: ["Ужасы", "Триллер"], description: "История семьи, которая сталкивается с древним злом, требующим помощи знаменитых демонологов Эда и Лоррейн Уорренов.", director: "Джеймс Ван", duration: "112 мин." },
    "11": { title: "Интерстеллар", originalTitle: "Interstellar", poster: "img/Interstellar.jpg", rating: 8.6, year: 2014, genre: ["Фантастика", "Драма", "Приключения"], description: "Команда исследователей отправляется в путешествие через червоточину, чтобы найти новую планету для человечества.", director: "Кристофер Нолан", duration: "169 мин." },
    "12": { title: "Начало", originalTitle: "Inception", poster: "img/Inception.jpg", rating: 8.8, year: 2010, genre: ["Фантастика", "Боевик", "Триллер"], description: "Профессиональный вор, который крадет информацию, проникая в подсознание людей через их сны.", director: "Кристофер Нолан", duration: "148 мин." }
};

// Преобразуем объект в массив и добавляем ID в каждый объект
window.allMovies = Object.keys(movieDBData).map(id => {
    return {
        id: id,
        ...movieDBData[id]
    };
});