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
if (!isset($_POST['payment_id'])) {
    echo json_encode(['success' => false, 'error' => 'Payment ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("DELETE FROM user_payment_data WHERE payment_id = ?");
    $result = $stmt->execute([$_POST['payment_id']]);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete payment']);
    }
} catch(Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>