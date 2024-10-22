<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

require_once 'conn.php';

// Get POST data
$amount = filter_input(INPUT_POST, 'amount', FILTER_VALIDATE_FLOAT);
$password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);
$user_id = $_SESSION['user_id'];
$active_card_index = $_SESSION['active_card_index'];

if (!isset($_SESSION['user_cards']) || empty($_SESSION['user_cards'])) {
    echo json_encode(['status' => 'error', 'message' => 'No card available']);
    exit;
}

// Verify user password
$sql = "SELECT password FROM users WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!password_verify($password, $user['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
    exit;
}

// Get current card
$active_card = $_SESSION['user_cards'][$active_card_index];
$card_id = $active_card['id'];

// Update balance in database
$sql = "UPDATE user_payment_data SET user_payment_balance = user_payment_balance + ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("di", $amount, $card_id);

if ($stmt->execute()) {
    // Update session data
    $_SESSION['user_cards'][$active_card_index]['user_payment_balance'] += $amount;
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Top up successful',
        'newBalance' => number_format($_SESSION['user_cards'][$active_card_index]['user_payment_balance'], 2)
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to process top up']);
}

$stmt->close();
$conn->close();
?>