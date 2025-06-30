<?php
session_start();
// Уничтожаем сессию
session_unset();
session_destroy();
header('Content-Type: application/json');
echo json_encode(['success' => true]);
?>