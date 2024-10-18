<?php
// Enable error reporting and logging
error_reporting(E_ALL);
ini_set('display_errors', 0); // Temporarily enable display errors for debugging
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

header('Content-Type: application/json');

try {
    $first_name = $_POST['first_user_name'] ?? '';
    $last_name = $_POST['last_user_name'] ?? '';
    $user_username = $_POST['username'] ?? '';
    $user_password = $_POST['password'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $birthday = $_POST['birthday'] ?? '';
    $gender = $_POST['gender'] ?? '';

    // Log the received data
    error_log("Received data: " . print_r($_POST, true));

    require_once __DIR__ . '/conn.php';

    if (!isset($conn)) {
        throw new Exception("Database connection not established");
    }

    $sql = "INSERT INTO user_account_data (user_firstname, user_lastname, user_username, user_password, user_email, user_address, user_birthday, user_gender)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . mysqli_error($conn));
    }

    mysqli_stmt_bind_param($stmt, "ssssssss", $first_name, $last_name, $user_username, $user_password, $email, $address, $birthday, $gender);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'Account created successfully']);
    } else {
        throw new Exception("Execute failed: " . mysqli_stmt_error($stmt));
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);

} catch (Exception $e) {
    error_log("Error in insert.php: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>