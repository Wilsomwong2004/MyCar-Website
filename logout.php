<?php
session_start();

// Unset all session variables
$_SESSION = array();

// Destroy the session
session_destroy();

// Send a JSON response
header('Content-Type: application/json');
echo json_encode(['success' => true]);
exit;
?>