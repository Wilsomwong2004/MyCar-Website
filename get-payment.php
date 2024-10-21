<?php
session_start();
require_once 'db_connection.php';

// Check if the user is logged in and is an admin
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
    header('HTTP/1.0 403 Forbidden');
    echo json_encode(['error' => 'Access denied']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT p.*, u.user_firstname, u.user_lastname 
                           FROM user_payment_data p
                           JOIN users u ON p.user_id = u.user_id
                           ORDER BY p.payment_date DESC");
    $stmt->execute();
    $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($payments);
} catch (PDOException $e) {
    error_log($e->getMessage());
    echo json_encode(['error' => 'Database error occurred']);
}