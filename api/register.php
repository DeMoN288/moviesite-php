<?php
// --- ФАЙЛ: api/register.php (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---

header('Content-Type: application/json');

$usersFile = 'users.json';

// --- ШАГ 1: Проверяем, что данные пришли методом POST ---
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Неверный метод запроса.']);
    exit;
}

// --- ШАГ 2: Получаем данные из $_POST, а не из php://input ---
$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? $_POST['password'] : '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Имя пользователя и пароль обязательны.']);
    exit;
}

// --- ШАГ 3: Загружаем пользователей и проверяем существование ---
$users = [];
if (file_exists($usersFile) && filesize($usersFile) > 0) {
    $users = json_decode(file_get_contents($usersFile), true) ?: [];
}

// Проверяем, не занято ли имя пользователя
foreach ($users as $user) {
    if (isset($user['username']) && $user['username'] === $username) {
        echo json_encode(['success' => false, 'message' => 'Пользователь с таким именем уже существует.']);
        exit;
    }
}

// --- ШАГ 4: Хэшируем пароль и сохраняем ---
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$newUser = [
    'id' => time(),
    'username' => $username,
    'password' => $hashedPassword,
    'registered_at' => date('Y-m-d H:i:s'),
];

$users[] = $newUser;

if (file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    // После успешной регистрации можно сразу начать сессию
    session_start();
    $_SESSION['user'] = ['id' => $newUser['id'], 'username' => $newUser['username']];
    echo json_encode(['success' => true, 'message' => 'Регистрация прошла успешно!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка на сервере: не удалось сохранить данные.']);
}
?>