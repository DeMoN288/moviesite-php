<?php
// --- ФАЙЛ: api/auth_check.php (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---

session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user']) && isset($_SESSION['user']['username'])) {
    // Если пользователь в сессии, отправляем его данные
    echo json_encode([
        'loggedIn' => true,
        'user' => $_SESSION['user'] // Отправляем весь объект пользователя
    ]);
} else {
    // Если нет, сообщаем об этом
    echo json_encode(['loggedIn' => false]);
}
?>