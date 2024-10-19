<?php
session_start();

// For debugging purposes
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

// Function to safely output JSON
function outputJSON($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

try {
    require_once __DIR__ . '/conn.php';

    if (!isset($conn)) {
        throw new Exception("Database connection not established");
    }

    // Check if it's an AJAX request
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        // Log received data
        error_log("Received POST data: " . print_r($_POST, true));

        // Login validation
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $action = $_POST['action'] ?? '';
            $userInput = $_POST['userInput'] ?? '';

            if ($action == 'checkUser') {
                // Check if user exists
                $sql = "SELECT * FROM user_account_data WHERE user_email = ? OR user_username = ?";
                $stmt = mysqli_prepare($conn, $sql);
                if (!$stmt) {
                    throw new Exception("Prepare failed: " . mysqli_error($conn));
                }
                mysqli_stmt_bind_param($stmt, "ss", $userInput, $userInput);
                mysqli_stmt_execute($stmt);
                $result = mysqli_stmt_get_result($stmt);

                if (mysqli_num_rows($result) == 1) {
                    outputJSON(['status' => 'success', 'message' => 'User found']);
                } else {
                    outputJSON(['status' => 'error', 'message' => 'User not found']);
                }
            } elseif ($action == 'login') {
                $password = $_POST['password'] ?? '';

                // Perform login
                $sql = "SELECT * FROM user_account_data WHERE (user_email = ? OR user_username = ?) AND user_password = ?";
                $stmt = mysqli_prepare($conn, $sql);
                mysqli_stmt_bind_param($stmt, "sss", $userInput, $userInput, $password);
                mysqli_stmt_execute($stmt);
                $result = mysqli_stmt_get_result($stmt);

                if ($result && mysqli_num_rows($result) == 1) {
                    $user = mysqli_fetch_assoc($result);
                    $_SESSION['user_email'] = $user['user_email'];
                    error_log("Login successful for user: $userInput");
                    outputJSON(['status' => 'success', 'message' => 'Login successful']);
                } else {
                    error_log("Login failed: Invalid credentials for user: $userInput");
                    outputJSON(['status' => 'error', 'message' => 'Invalid username/email or password']);
                }
            } else {
                outputJSON(['status' => 'error', 'message' => 'Invalid action']);
            }
        } else {
            outputJSON(['status' => 'error', 'message' => 'Invalid request method']);
        }
    }

    

    // Forgot password validation
    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['forgot-email'])) {
        $forgot_email = $_POST['forgot-email'];
        
        error_log("Attempting to reset password for email: $forgot_email");
        
        // Check if the email is valid
        if (filter_var($forgot_email, FILTER_VALIDATE_EMAIL)) {
            // Check if the email exists in the database
            $sql = "SELECT * FROM user_account_data WHERE user_email = '$forgot_email'";
            $result = mysqli_query($conn, $sql);
            
            if ($result && mysqli_num_rows($result) == 1) {
                $user = mysqli_fetch_assoc($result);
                // Generate a random verification code
                $verification_code = bin2hex(random_bytes(16));
                // Insert the verification code into the database
                $sql = "UPDATE user_account_data SET user_verification_code = '$verification_code' WHERE user_email = '$forgot_email'";
                mysqli_query($conn, $sql);
                // Send the verification code to the user's email
                $to = $user['user_email'];
                $subject = "MyCar Password Reset Verification Code";
                $message = "Your verification code for resetting your password is: $verification_code";
                $headers = "From: MyCar Support <<EMAIL>>";
                mail($to, $subject, $message, $headers);
                // Display the email and verification code to the user
                $reset_message = "An email has been sent to $forgot_email with a verification code. Please enter the code below to reset your password.";
                echo json_encode(['status' => 'success', 'message' => $reset_message]);
            } else {
                $reset_message = "Invalid email. Please enter a valid email to reset your password.";
                echo json_encode(['status' => 'error', 'message' => $reset_message]);
            }
        } else {
            $reset_message = "Invalid email. Please enter a valid email to reset your password.";
            echo json_encode(['status' => 'error', 'message' => $reset_message]);
        }
        exit();
    }

    // Reset password validation
    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['verification-code']) && isset($_POST['new-password'])) {
        $verification_code = $_POST['verification-code'];
        $new_password = $_POST['new-password'];
        
        error_log("Attempting to reset password with verification code: $verification_code");
        
        // Check if the verification code is valid
        $sql = "SELECT * FROM user_account_data WHERE user_verification_code = '$verification_code'";
        $result = mysqli_query($conn, $sql);
        
        if ($result && mysqli_num_rows($result) == 1) {
            $user = mysqli_fetch_assoc($result);
            // Update the user's password in the database
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            $sql = "UPDATE user_account_data SET user_password = '$hashed_password', user_verification_code = NULL WHERE user_email = '$user[user_email]'";
            mysqli_query($conn, $sql);
            // Display a success message to the user
            $reset_message = "Your password has been reset. You can now log in with your new password.";
            echo json_encode(['status' => 'success', 'message' => $reset_message]);
        } else {
            $reset_message = "Invalid verification code. Please try again.";
            echo json_encode(['status' => 'error', 'message' => $reset_message]);
        }
        exit();
    }

} catch (Exception $e) {
    error_log("Caught exception: " . $e->getMessage());
    if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        outputJSON(['status' => 'error', 'message' => 'An internal error occurred. Please try again later.']);
    }
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MyCar</title>
        <link rel="stylesheet" href="assets/css/index.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    </head>
    <body>
        <div class="login-container">
            <div class="login-left">
                <div class="overlay">
                    <img src="assets/css/pic/mycarlogo_light.png" alt="MyCar Logo" class="mycarlogo-image">
                    <p>"Ride Easy, Ride Smart"</p>
                </div>
            </div>
            <div class="login-right">
                <img src="assets/css/pic/Unknown_acc-removebg.png" alt="Anonymous Account" class="login-account-image">
                <h2>Login your account</h2>
                <p>Enter your username or email to sign in for this app</p>
                <form class="sign-in-forms" id="login-form" method="post">
                    <input type="text" name="userInput" id="user-input" placeholder="Enter your username or email" required>
                    <div id="user-error" class="error-message"></div>
                    <input type="password" name="password" id="password-input" placeholder="Enter your password" style="display: none;">
                    <div id="password-error" class="error-message"></div>
                    <button type="submit" id="sign-in-button">Sign in with email</button>
                </form>
                <div class="forgot-password">
                    <a href="#" id="forgot-password-link">Forgot password?</a>
                </div>
                <div class="login-descriptions">
                    <p>Haven't an account? </p>
                    <a href="signup_page.php">Sign up</a>
                </div>
            </div>
        </div>
    </div>

    <div id="forgot-password-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Reset Password</h2>
            <div id="reset-email-container">
                <input type="email" id="reset-email-input" placeholder="Enter your email">
                <button id="get-verification-code">Get Verification Code</button>
            </div>
            <div id="verification-container" style="display: none;">
                <input type="text" id="verification-code-input" placeholder="Enter verification code">
                <div id="verification-error" style="color: red; display: none;"></div>
                <button id="submit-verification">Submit</button>
            </div>
            <div id="new-password-container" style="display: none;">
                <p id="reset-email-display"></p>
                <input type="password" id="new-password-input" placeholder="Enter new password">
                <button id="submit-new-password">Reset Password</button>
            </div>
            <div id="countdown" style="display: none;"></div>
        </div>
    </div>

    <script src="assets/javascript/index.js"></script>
    </body>
</html>