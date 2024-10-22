<?php
// Enable error reporting and logging
// error_reporting(E_ALL);
// ini_set('display_errors', 0);
// ini_set('log_errors', 1);
// ini_set('error_log', 'php_errors.log');

// Start the session
session_start();

try {
    // Check if the user is logged in
    if (isset($_SESSION['user_id'])) {
        // Return the user's ID from the session
        echo json_encode(['status' => 'success', 'userId' => $_SESSION['user_id']]);
        exit;
    } else {
        // Fetch the user's ID from the database
        require_once __DIR__ . '/conn.php';

        if (!isset($conn)) {
            throw new Exception("Database connection not established");
        }

        // Assuming you have a 'user_account_data' table
        $sql = "SELECT id FROM user_account_data WHERE user_email = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $_SESSION['user_email']);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);

        if ($result && mysqli_num_rows($result) == 1) {
            $user = mysqli_fetch_assoc($result);
            $userId = $user['id'];

            // Store the user's ID in the session
            $_SESSION['user_id'] = $userId;

            // Return the user's ID
            echo json_encode(['status' => 'success', 'userId' => $userId]);
            exit;
        } else {
            throw new Exception("User not found");
        }
    }
} catch (Exception $e) {
    error_log("Error in get_user_id.php: " . $e->getMessage());
    echo json_encode(['status' => 'error', 'message' => 'An error occurred while processing your request.']);
    exit;
}