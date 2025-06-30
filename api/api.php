<?php
// --- ФАЙЛ: api/api.php (ВОЗВРАЩЕНА ВЕРСИЯ БЕЗ КОММЕНТАРИЕВ И РОЛЕЙ) ---

session_start();
header('Content-Type: application/json');

$db = [
    'favorites' => __DIR__ . '/favorites.json',
    'watched' => __DIR__ . '/watched.json',
    'planned' => __DIR__ . '/planned.json',
    'ratings' => __DIR__ . '/ratings.json'
];

function readDb($fileKey) {
    global $db;
    $filePath = $db[$fileKey];
    if (!file_exists($filePath)) return [];
    return json_decode(file_get_contents($filePath), true) ?: [];
}

function writeDb($fileKey, $data) {
    global $db;
    $filePath = $db[$fileKey];
    file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function getRatingsForMovie($movieId, $userId) {
    $allRatings = readDb('ratings');
    $movieRatings = $allRatings[$movieId] ?? ['likes' => [], 'dislikes' => []];
    $response = ['success' => true, 'likes' => count($movieRatings['likes']), 'dislikes' => count($movieRatings['dislikes']), 'userVote' => null];
    if ($userId) {
        if (in_array($userId, $movieRatings['likes'])) $response['userVote'] = 'like';
        if (in_array($userId, $movieRatings['dislikes'])) $response['userVote'] = 'dislike';
    }
    return $response;
}

$userId = $_SESSION['user']['id'] ?? null;
$action = $_GET['action'] ?? $_POST['action'] ?? null;

switch ($action) {
    case 'getList':
        $listType = $_GET['list'] ?? null;
        if (!$userId || !isset($db[$listType])) { echo json_encode(['success' => true, 'list' => []]); exit; }
        $allData = readDb($listType);
        echo json_encode(['success' => true, 'list' => $allData[$userId] ?? []]);
        break;

    case 'toggleList':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !$userId) { http_response_code(400); exit; }
        $listType = $_POST['list'] ?? null;
        $movieId = $_POST['movieId'] ?? null;
        if (!$listType || !$movieId || !isset($db[$listType])) { http_response_code(400); exit; }
        $allData = readDb($listType);
        $userList = $allData[$userId] ?? [];
        if (in_array($movieId, $userList)) {
            $userList = array_values(array_diff($userList, [$movieId]));
            $status = 'removed';
        } else {
            $userList[] = $movieId;
            $status = 'added';
        }
        $allData[$userId] = $userList;
        writeDb($listType, $allData);
        echo json_encode(['success' => true, 'status' => $status]);
        break;

    case 'getRatings':
        $movieId = $_GET['movieId'] ?? null;
        if (!$movieId) { http_response_code(400); exit; }
        echo json_encode(getRatingsForMovie($movieId, $userId));
        break;

    case 'rateMovie':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !$userId) { http_response_code(400); exit; }
        $movieId = $_POST['movieId'] ?? null;
        $voteType = $_POST['vote'] ?? null;
        if (!$movieId || !in_array($voteType, ['like', 'dislike'])) { http_response_code(400); exit; }
        $allRatings = readDb('ratings');
        $movieRatings = $allRatings[$movieId] ?? ['likes' => [], 'dislikes' => []];
        $movieRatings['likes'] = array_values(array_diff($movieRatings['likes'], [$userId]));
        $movieRatings['dislikes'] = array_values(array_diff($movieRatings['dislikes'], [$userId]));
        if ($_POST['currentVote'] !== $voteType) { $movieRatings[$voteType . 's'][] = $userId; }
        $allRatings[$movieId] = $movieRatings;
        writeDb('ratings', $allRatings);
        echo json_encode(getRatingsForMovie($movieId, $userId));
        break;
        
    case 'changeUsername':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !$userId) { http_response_code(403); echo json_encode(['success' => false, 'message' => 'Доступ запрещен.']); exit; }
        $newUsername = trim($_POST['newUsername'] ?? '');
        if (empty($newUsername)) { echo json_encode(['success' => false, 'message' => 'Имя пользователя не может быть пустым.']); exit; }
        if (strlen($newUsername) < 3) { echo json_encode(['success' => false, 'message' => 'Имя должно содержать минимум 3 символа.']); exit; }
        $usersFile = __DIR__ . '/users.json';
        $users = json_decode(file_get_contents($usersFile), true);
        foreach ($users as $user) { if ($user['id'] != $userId && strtolower($user['username']) === strtolower($newUsername)) { echo json_encode(['success' => false, 'message' => 'Это имя уже занято.']); exit; } }
        $userUpdated = false;
        foreach ($users as $key => $user) { if ($user['id'] == $userId) { $users[$key]['username'] = $newUsername; $userUpdated = true; break; } }
        if ($userUpdated) { file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)); $_SESSION['user']['username'] = $newUsername; echo json_encode(['success' => true, 'newUsername' => $newUsername]); } else { echo json_encode(['success' => false, 'message' => 'Не удалось найти пользователя для обновления.']); }
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid action.']);
        break;
}
?>