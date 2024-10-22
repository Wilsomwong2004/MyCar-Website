<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_email'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit();
}

if (!isset($_SESSION['user_cards']) || empty($_SESSION['user_cards'])) {
    echo json_encode(['status' => 'error', 'message' => 'No cards available']);
    exit();
}

$cardCount = count($_SESSION['user_cards']);

if ($cardCount === 1) {
    $active_card = $_SESSION['user_cards'][0];
    $_SESSION['active_card_index'] = 0;
} else {
    // Switch to the next card
    $_SESSION['active_card_index'] = ($_SESSION['active_card_index'] + 1) % $cardCount;
    $active_card = $_SESSION['user_cards'][$_SESSION['active_card_index']];
}

// Prepare the response data
$response = [
    'status' => 'success',
    'card' => [
        'balance' => $active_card['user_payment_balance'],
        'cardNumber' => $active_card['user_payment_cardnumber'],
        'cardName' => $active_card['user_payment_cardname'],
        'bankName' => $active_card['user_payment_bankname'],
        'expiryDate' => $active_card['user_payment_cardexpdate'],
    ],
    'cardCount' => $cardCount
];

echo json_encode($response);
?>