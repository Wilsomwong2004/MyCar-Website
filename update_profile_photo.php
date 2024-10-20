<?php
session_start();
require_once 'conn.php';

// Enable error reporting and logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

header('Content-Type: application/json');

try {
    if (!isset($_SESSION['user_email'])) {
        throw new Exception("User not logged in");
    }

    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("No file uploaded or upload error");
    }

    $file = $_FILES['photo'];
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (!in_array($file['type'], $allowedTypes)) {
        throw new Exception("Invalid file type. Only JPG, PNG, and GIF are allowed.");
    }

    $maxFileSize = 5 * 1024 * 1024; // 5 MB
    if ($file['size'] > $maxFileSize) {
        throw new Exception("File is too large. Maximum size is 5 MB.");
    }

    $uploadDir = './assets/css/pic/profile_pics/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $fileName = uniqid() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception("Failed to move uploaded file.");
    }

    $relativePath = $targetPath;
    $userEmail = $_SESSION['user_email'];

    $stmt = $conn->prepare("UPDATE user_account_data SET user_profile_pic = ? WHERE user_email = ?");
    $stmt->bind_param("ss", $relativePath, $userEmail);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update database: " . $stmt->error);
    }

    $_SESSION['user_profile_pic'] = $relativePath;

    echo json_encode([
        'status' => 'success',
        'message' => 'Profile photo updated successfully',
        'new_photo_url' => $relativePath
    ]);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}