<?php
session_start();
header('Content-Type: application/json');

// Enable error reporting and logging
// error_reporting(E_ALL);
// ini_set('display_errors', 0);
// ini_set('log_errors', 1);
// ini_set('error_log', 'php_errors.log');

try {
    if (!isset($_SESSION['user_email'])) {
        throw new Exception("User not logged in");
    }

    require_once __DIR__ . '/conn.php';

    if (!isset($conn)) {
        throw new Exception("Database connection not established");
    }

    // Get the user's email from the session
    $user_email = $_SESSION['user_email'];

    // Start a transaction
    mysqli_begin_transaction($conn);

    // Delete the user's account
    $sql = "DELETE FROM user_account_data WHERE user_email = ?";
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . mysqli_error($conn));
    }

    mysqli_stmt_bind_param($stmt, "s", $user_email);

    if (!mysqli_stmt_execute($stmt)) {
        throw new Exception("Execute failed: " . mysqli_stmt_error($stmt));
    }

    mysqli_stmt_close($stmt);

    // Commit the transaction
    mysqli_commit($conn);

    // Destroy the session
    session_destroy();

    echo json_encode(['status' => 'success', 'message' => 'Account deleted successfully']);

} catch (Exception $e) {
    // Rollback the transaction if an error occurred
    if (isset($conn)) {
        mysqli_rollback($conn);
    }

    error_log("Error in delete_account.php: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
} finally {
    if (isset($conn)) {
        mysqli_close($conn);
    }
}
?>