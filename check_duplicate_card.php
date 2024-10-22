<?php
header('Content-Type: application/json');

try {
    require_once __DIR__ . '/conn.php';

    $card_number = $_POST['number_on_card'] ?? '';
    $user_id = $_POST['user_id'] ?? '';

    if (empty($card_number)) {
        throw new Exception("Missing card number");
    }

    // Check if the card exists anywhere in the system
    $sql = "SELECT COUNT(*) as count FROM user_payment_data WHERE user_payment_cardnumber = ?";
    $stmt = mysqli_prepare($conn, $sql);
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . mysqli_error($conn));
    }

    mysqli_stmt_bind_param($stmt, "s", $card_number);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);

    echo json_encode([
        'status' => 'success',
        'exists' => $row['count'] > 0,
        'message' => $row['count'] > 0 ? 'This card number is already registered in the system. Each card can only be registered once.' : ''
    ]);

    mysqli_stmt_close($stmt);
    mysqli_close($conn);

} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while checking the card.'
    ]);
}
?>