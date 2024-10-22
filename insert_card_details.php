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

    // Validate input data
    if (empty($bank_name) || empty($card_number) || empty($card_name) || empty($card_expdate) || empty($card_cvv) || empty($card_password) || empty($user_id)) {
        throw new Exception("All fields are required");
    }

    require_once __DIR__ . '/conn.php';

    if (!isset($conn)) {
        throw new Exception("Database connection not established");
    }

    // First check if this card number exists ANYWHERE in the system
    $check_sql = "SELECT COUNT(*) as count FROM user_payment_data WHERE user_payment_cardnumber = ?";
    $check_stmt = mysqli_prepare($conn, $check_sql);
    
    if (!$check_stmt) {
        throw new Exception("Prepare check failed: " . mysqli_error($conn));
    }

    mysqli_stmt_bind_param($check_stmt, "s", $card_number);
    mysqli_stmt_execute($check_stmt);
    $result = mysqli_stmt_get_result($check_stmt);
    $row = mysqli_fetch_assoc($result);

    if ($row['count'] > 0) {
        echo json_encode([
            'status' => 'error',
            'message' => 'This card number is already registered in the system. Each card can only be registered once.'
        ]);
        mysqli_stmt_close($check_stmt);
        mysqli_close($conn);
        exit;
    }

    mysqli_stmt_close($check_stmt);

    // If no duplicate found, proceed with insertion
    $sql = "INSERT INTO user_payment_data (id, user_payment_bankname, user_payment_cardnumber, user_payment_cardname, user_payment_cardexpdate, user_payment_cvv, user_payment_password)
            VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        throw new Exception("Prepare failed: " . mysqli_error($conn));
    }

    mysqli_stmt_bind_param($stmt, "sssssss", $user_id, $bank_name, $card_number, $card_name, $card_expdate, $card_cvv, $card_password);

    if (mysqli_stmt_execute($stmt)) {
        // Update session data
        if (!isset($_SESSION['user_cards'])) {
            $_SESSION['user_cards'] = [];
        }

        $newCard = [
            'payment_id' => mysqli_insert_id($conn),
            'id' => $user_id,
            'user_payment_bankname' => $bank_name,
            'user_payment_cardnumber' => $card_number,
            'user_payment_cardname' => $card_name,
            'user_payment_cardexpdate' => $card_expdate,
            'user_payment_cvv' => $card_cvv,
            'user_payment_password' => $card_password,
            'user_payment_balance' => 0
        ];

        $_SESSION['user_cards'][] = $newCard;
        $_SESSION['active_card_index'] = count($_SESSION['user_cards']) - 1;

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
        'message' => 'An error occurred while processing your request.'
    ]);
}
?>