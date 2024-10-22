<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_cards']) || empty($_SESSION['user_cards'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'No cards available'
    ]);
    exit;
}

// Get the current number of cards
$cardCount = count($_SESSION['user_cards']);

// Increment the active card index and wrap around if necessary
$_SESSION['active_card_index'] = ($_SESSION['active_card_index'] + 1) % $cardCount;

// Get the new active card
$activeCard = $_SESSION['user_cards'][$_SESSION['active_card_index']];

// Format the response with string values
$response = [
    'status' => 'success',
    'cardCount' => $cardCount,
    'card' => [
        'cardNumber' => strval($activeCard['user_payment_cardnumber']), // Ensure it's a string
        'bankName' => strval($activeCard['user_payment_bankname']),
        'cardName' => strval($activeCard['user_payment_cardname']),
        'expiryDate' => strval($activeCard['user_payment_cardexpdate']),
        'balance' => number_format((float)$activeCard['user_payment_balance'], 2)
    ]
];

echo json_encode($response);
?>