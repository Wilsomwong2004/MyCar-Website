<?php
session_start();

// Enable error reporting and logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

require_once 'conn.php'; // Assuming this file contains your database connection

header('Content-Type: application/json');

if (!isset($_SESSION['user_email'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_email = $_SESSION['user_email'];
$current_password = $_POST['current_password'] ?? '';
$new_username = $_POST['new_username'] ?? '';
$new_password = $_POST['new_password'] ?? '';

// Verify current password
$stmt = $conn->prepare("SELECT user_password FROM user_account_data WHERE user_email = ?");
$stmt->bind_param("s", $user_email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user || $current_password !== $user['user_password']) {
    echo json_encode(['success' => false, 'message' => 'Current password is incorrect']);
    exit;
}

// Prepare update query
$updates = [];
$types = "";
$params = [];

if ($new_username !== '') {
    $updates[] = "user_username = ?";
    $types .= "s";
    $params[] = $new_username;
}

if ($new_password !== '') {
    $updates[] = "user_password = ?";
    $types .= "s";
    $params[] = $new_password; // Store new password as plain text
}

if (empty($updates)) {
    echo json_encode(['success' => false, 'message' => 'No changes requested']);
    exit;
}

$sql = "UPDATE user_account_data SET " . implode(", ", $updates) . " WHERE user_email = ?";
$types .= "s";
$params[] = $user_email;

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    if ($new_username !== '') {
        $_SESSION['user_username'] = $new_username;
    }
    echo json_encode(['success' => true, 'message' => 'Credentials updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error updating credentials']);
}

$stmt->close();
$conn->close();
?>