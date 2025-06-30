<?php
// --- ФАЙЛ: api/login.php (ИСПРАВЛЕННАЯ ВЕРСИЯ С ДОБАВЛЕНИЕМ РОЛИ) ---

session_start();
header('Content-Type: application/json');

$usersFile = 'users.json';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Неверный метод запроса.']);
    exit;
}

$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Введите имя пользователя и пароль.']);
    exit;
}

if (!file_exists($usersFile)) {
    echo json_encode(['success' => false, 'message' => 'Неверное имя пользователя или пароль.']);
    exit;
}

$users = json_decode(file_get_contents($usersFile), true);
$foundUser = null;

foreach ($users as $user) {
    if (isset($user['username']) && $user['username'] === $username) {
        $foundUser = $user;
        break;
    }
}

if ($foundUser && password_verify($password, $foundUser['password'])) {
    // Пароль верный, создаем сессию
    // ↓↓↓ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: ДОБАВЛЯЕМ РОЛЬ В СЕССИЮ ПРИ ВХОДЕ ↓↓↓
    $_SESSION['user'] = [
        'id' => $foundUser['id'],
        'username' => $foundUser['username'],
        'role' => $foundUser['role'] ?? 'user' // Добавляем роль, по умолчанию 'user'
    ];
    echo json_encode(['success' => true, 'message' => 'Вход выполнен успешно!']);
} else {
    // Пользователь не найден или пароль неверный
    echo json_encode(['success' => false, 'message' => 'Неверное имя пользователя или пароль.']);
}
?>