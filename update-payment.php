<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in and is admin
if (!isset($_SESSION['user_role']) || $_SESSION['user_role'] !== 'admin') {
    echo json_encode(['success' => false, 'error' => 'Unauthorized access']);
    exit;
}

require_once 'conn.php';

// Validate input
if (!isset($_POST['payment_id']) || !isset($_POST['user_payment_bankname']) || 
    !isset($_POST['user_payment_cardnumber']) || !isset($_POST['user_payment_balance'])) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE user_payment_data
                          SET user_payment_bankname = ?,
                              user_payment_cardnumber = ?,
                              user_payment_balance = ?
                          WHERE payment_id = ?");

    $result = $stmt->execute([
        $_POST['user_payment_bankname'],
        $_POST['user_payment_cardnumber'],
        $_POST['user_payment_balance'],
        $_POST['payment_id']
    ]);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update payment']);
    }
} catch(Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>