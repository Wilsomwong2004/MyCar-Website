<?php
// Enable error reporting and logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

header('Content-Type: application/json');

try {
    // Get the form data
    $bank_name = $_POST['bank_name'] ?? '';
    $card_number = $_POST['number_on_card'] ?? '';
    $card_name = $_POST['name_on_card'] ?? '';
    $card_expdate = $_POST['card_expiration_date'] ?? '';
    $card_cvv = $_POST['card_cvv_number'] ?? '';
    $card_password = $_POST['card_password'] ?? '';
    $user_id = $_POST['user_id'] ?? '';

    // Log the received data (remove this in production)
    error_log("Received card data: " . print_r($_POST, true));

    require_once __DIR__ . '/conn.php';

    if (!isset($conn)) {
        throw new Exception("Database connection not established");
    }

    // Insert the card details
    $sql = "INSERT INTO user_payment_data (id, user_payment_bankname, user_payment_cardnumber, user_payment_cardname, user_payment_cardexpdate, user_payment_cvv, user_payment_password)
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . mysqli_error($conn));
    }

    // Bind parameters and execute
    mysqli_stmt_bind_param($stmt, "isssss", $user_id, $bank_name, $card_number, $card_name, $card_expdate, $card_cvv);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['status' => 'success', 'message' => 'Card details added successfully']);
    } else {
        throw new Exception("Execute failed: " . mysqli_stmt_error($stmt));
    }

    mysqli_stmt_close($stmt);
    mysqli_close($conn);

} catch (Exception $e) {
    error_log("Error in insert_card_details.php: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>