<?php
require_once 'conn.php';

header('Content-Type: application/json');

try {
    // Join query to get both payment and user data
    $sql = "SELECT p.*, u.user_firstname, u.user_lastname
            FROM user_payment_data p
            LEFT JOIN user_account_data u ON p.id = u.id";
    
    $result = mysqli_query($conn, $sql);
    
    if (!$result) {
        throw new Exception(mysqli_error($conn));
    }
    
    $payments = [];
    while ($row = mysqli_fetch_assoc($result)) {
        // Ensure all necessary fields are present
        $payment = [
            'payment_id' => $row['payment_id'],
            'id' => $row['id'], // This is the user_id
            'user_firstname' => $row['user_firstname'] ?? '',
            'user_lastname' => $row['user_lastname'] ?? '',
            'user_payment_bankname' => $row['user_payment_bankname'] ?? '',
            'user_payment_cardnumber' => $row['user_payment_cardnumber'] ?? '',
            'user_payment_balance' => $row['user_payment_balance'] ?? '0.00'
        ];
        $payments[] = $payment;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $payments
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>