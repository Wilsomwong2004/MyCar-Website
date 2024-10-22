<?php
session_start();

// Disable error output - very important to prevent HTML errors from breaking JSON
error_reporting(0);
ini_set('display_errors', 0);

// Set JSON header before any output
header('Content-Type: application/json');

// Function to send JSON response and exit
function sendJsonResponse($status, $message, $data = null) {
    $response = ['status' => $status, 'message' => $message];
    if ($data !== null) {
        $response = array_merge($response, $data);
    }
    echo json_encode($response);
    exit;
}

// Check if required files and sessions exist
if (!file_exists('conn.php')) {
    sendJsonResponse('error', 'Database connection file missing');
}

require_once 'conn.php';

// Validate session
if (!isset($_SESSION['user_id'])) {
    sendJsonResponse('error', 'User session expired');
}

// Validate POST data
$amount = filter_input(INPUT_POST, 'amount', FILTER_VALIDATE_FLOAT);
$password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
$user_id = $_SESSION['user_id'];

if (!isset($_SESSION['user_cards']) || empty($_SESSION['user_cards'])) {
    sendJsonResponse('error', 'No card available');
}

if (!isset($_SESSION['active_card_index'])) {
    sendJsonResponse('error', 'No active card selected');
}

$active_card_index = $_SESSION['active_card_index'];

// Validate amount
if (!$amount || $amount <= 0) {
    sendJsonResponse('error', 'Invalid amount');
}

// Verify user password
try {
    $sql = "SELECT password FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        sendJsonResponse('error', 'Database error');
    }
    
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    if (!$user || !password_verify($password, $user['password'])) {
        sendJsonResponse('error', 'Invalid password');
    }
    
    // Get current card
    $active_card = $_SESSION['user_cards'][$active_card_index];
    $card_id = $active_card['id'];
    
    // Update balance in database
    $sql = "UPDATE user_payment_data SET user_payment_balance = user_payment_balance + ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        sendJsonResponse('error', 'Database error');
    }
    
    $stmt->bind_param("di", $amount, $card_id);
    
    if ($stmt->execute()) {
        // Update session data
        $_SESSION['user_cards'][$active_card_index]['user_payment_balance'] += $amount;
        
        sendJsonResponse('success', 'Top up successful', [
            'newBalance' => number_format($_SESSION['user_cards'][$active_card_index]['user_payment_balance'], 2)
        ]);
    } else {
        sendJsonResponse('error', 'Failed to process top up');
    }
    
} catch (Exception $e) {
    sendJsonResponse('error', 'An unexpected error occurred');
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>s