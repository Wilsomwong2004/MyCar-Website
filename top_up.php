<?php
session_start();

// Enable error logging to a file
ini_set('log_errors', 1);
ini_set('error_log', 'top_up_errors.log');

// Set JSON header
header('Content-Type: application/json');

// Function to log and send JSON response
function sendJsonResponse($status, $message, $data = null) {
    $response = [
        'status' => $status,
        'message' => $message
    ];
    
    // Add additional data if provided
    if ($data !== null) {
        if (is_array($data)) {
            $response = array_merge($response, $data);
        } else {
            $response['debug'] = $data;
        }
    }
    
    // Log debug information
    error_log("Sending response: " . json_encode($response));
    
    echo json_encode($response);
    exit;
}

try {
    // Check for connection file
    if (!file_exists('conn.php')) {
        sendJsonResponse('error', 'Configuration error', 'Database connection file missing');
    }

    require_once 'conn.php';

    // Log session and request data
    error_log("Top-up request received. POST data: " . json_encode(array_merge(
        $_POST,
        ['password' => '[REDACTED]']
    )));
    
    error_log("Session state: " . json_encode([
        'user_id_set' => isset($_SESSION['user_id']),
        'cards_set' => isset($_SESSION['user_cards']),
        'active_card_index_set' => isset($_SESSION['active_card_index'])
    ]));

    // Validate session
    if (!isset($_SESSION['user_id'])) {
        sendJsonResponse('error', 'Session expired', 'User ID not set in session');
    }

    // Get and validate POST data
    $amount = filter_input(INPUT_POST, 'amount', FILTER_VALIDATE_FLOAT);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
    $user_id = $_SESSION['user_id'];

    // Log user ID for debugging
    error_log("Processing top-up for user_id: " . $user_id);

    // Validate amount
    if (!$amount || $amount <= 0) {
        sendJsonResponse('error', 'Invalid amount', 'Amount validation failed: ' . $amount);
    }

    // Validate cards data
    if (!isset($_SESSION['user_cards']) || empty($_SESSION['user_cards'])) {
        sendJsonResponse('error', 'No card available', 'User cards not found in session');
    }

    if (!isset($_SESSION['active_card_index'])) {
        sendJsonResponse('error', 'No active card', 'Active card index not set');
    }

    $active_card_index = $_SESSION['active_card_index'];
    $active_card = $_SESSION['user_cards'][$active_card_index];

    // Log active card details for debugging
    error_log("Active card details: " . json_encode([
        'index' => $active_card_index,
        'id' => $active_card['id'] ?? 'not set',
        'payment_id' => $active_card['payment_id'] ?? 'not set'
    ]));

    // Verify password
    $sql = "SELECT user_password FROM user_account_data WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        sendJsonResponse('error', 'Database error', 'Failed to prepare password verification query: ' . $conn->error);
    }
    
    $stmt->bind_param("i", $user_id);
    
    if (!$stmt->execute()) {
        sendJsonResponse('error', 'Database error', 'Failed to execute password verification: ' . $stmt->error);
    }
    
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user || $user['user_password'] !== $password) {
        sendJsonResponse('error', 'Invalid password', 'Password verification failed');
    }

    // Update balance using the correct ID
    $update_sql = "UPDATE user_payment_data SET user_payment_balance = user_payment_balance + ? WHERE id = ? AND user_payment_cardnumber = ?";
    $update_stmt = $conn->prepare($update_sql);
    
    if (!$update_stmt) {
        sendJsonResponse('error', 'Database error', 'Failed to prepare balance update: ' . $conn->error);
    }
    
    // Use both ID and card number to ensure correct record update
    $card_number = $active_card['user_payment_cardnumber'];
    $update_stmt->bind_param("dis", $amount, $active_card['id'], $card_number);
    
    // Log the update query parameters
    error_log("Executing update with params: amount=$amount, id={$active_card['id']}, card_number=$card_number");
    
    if (!$update_stmt->execute()) {
        sendJsonResponse('error', 'Database error', 'Failed to execute balance update: ' . $update_stmt->error);
    }

    if ($update_stmt->affected_rows > 0) {
        // Update session data
        $_SESSION['user_cards'][$active_card_index]['user_payment_balance'] += $amount;
        
        // Get the updated balance from the database
        $balance_sql = "SELECT user_payment_balance FROM user_payment_data WHERE id = ?";
        $balance_stmt = $conn->prepare($balance_sql);
        $balance_stmt->bind_param("i", $active_card['id']);
        $balance_stmt->execute();
        $balance_result = $balance_stmt->get_result();
        $balance_row = $balance_result->fetch_assoc();
        
        $new_balance = $balance_row ? $balance_row['user_payment_balance'] : $_SESSION['user_cards'][$active_card_index]['user_payment_balance'];
        
        sendJsonResponse('success', 'Top up successful', [
            'newBalance' => number_format($new_balance, 2)
        ]);
    } else {
        error_log("Update query affected 0 rows. SQL: UPDATE user_payment_data SET user_payment_balance = user_payment_balance + $amount WHERE id = {$active_card['id']} AND user_payment_cardnumber = '$card_number'");
        sendJsonResponse('error', 'Update failed', 'No rows affected during balance update');
    }

} catch (Exception $e) {
    error_log("Top-up exception: " . $e->getMessage());
    sendJsonResponse('error', 'An unexpected error occurred', $e->getMessage());
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($update_stmt)) {
        $update_stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>