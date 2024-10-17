<?php

header('Content-Type: application/json');

$email = $_POST['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

// In a real-world scenario, you would generate a unique token,
// store it in the database along with the email and expiration time,
// and send an email with a verification link containing this token.

// For this example, we'll simulate sending an email
$to = $email;
$subject = "Verify Your Email";
$message = "Thank you for registering. Please click the link below to verify your email:\n\n";
$message .= "http://yourdomain.com/verify.php?email=" . urlencode($email) . "&token=SIMULATED_TOKEN";
$headers = "From: noreply@yourdomain.com";

// Simulate sending email (don't actually send in this example)
// mail($to, $subject, $message, $headers);

// For demonstration purposes, we'll just return success
echo json_encode(['success' => true, 'message' => 'Verification email sent']);
?>