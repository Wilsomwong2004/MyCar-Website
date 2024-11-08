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
                // Check if user is admin
                if ($userInput === 'admin') {
                    outputJSON(['status' => 'success', 'message' => 'Admin user found']);
                } else {
                    // Check if user exists in database
                    $sql = "SELECT * FROM user_account_data WHERE user_email = ? OR user_username = ?";
                    $stmt = mysqli_prepare($conn, $sql);
                    if (!$stmt) {
                        throw new Exception("Prepare failed: " . mysqli_error($conn));
                    }
                    mysqli_stmt_bind_param($stmt, "ss", $userInput, $userInput);
                    mysqli_stmt_execute($stmt);
                    $result = mysqli_stmt_get_result($stmt);
            
                    if (mysqli_num_rows($result) == 1) {
                        $user = mysqli_fetch_assoc($result);
                        outputJSON([
                            'status' => 'success', 
                            'message' => 'User found: ' . htmlspecialchars($user['user_username'])
                        ]);
                    } else {
                        outputJSON([
                            'status' => 'error', 
                            'message' => 'No user found with username/email: ' . htmlspecialchars($userInput)
                        ]);
                    }
                }
            } elseif ($action == 'login') {
                $password = $_POST['password'] ?? '';

                // Check for admin login
                if ($userInput === 'admin' && $password === '0000') {
                    $_SESSION['admin'] = true;
                    $_SESSION['user_id'] = 'admin';
                    $_SESSION['user_role'] = 'admin';
                    $_SESSION['user_username'] = 'admin';

                    error_log('Admin login successful - Session data:');
                    error_log(print_r($_SESSION, true));

                    outputJSON(['status' => 'success', 'message' => 'Admin login successful', 'redirect' => 'admin_page.php']);
                } else {
                    // Perform regular user login
                    $sql = "SELECT * FROM user_account_data WHERE (user_email = ? OR user_username = ?) AND user_password = ?";
                    $stmt = mysqli_prepare($conn, $sql);
                    mysqli_stmt_bind_param($stmt, "sss", $userInput, $userInput, $password);
                    mysqli_stmt_execute($stmt);
                    $result = mysqli_stmt_get_result($stmt);

                    if ($result && mysqli_num_rows($result) == 1) {
                        $user = mysqli_fetch_assoc($result);
                        $_SESSION['user_id'] = $user['id'];  // Ensure this line is present
                        $_SESSION['user_email'] = $user['user_email'];
                        $_SESSION['user_username'] = $user['user_username'];
                        $_SESSION['user_profile_pic'] = $user['user_profile_pic'];
                    
                        // Fetch the user's payment data
                        $sql = "SELECT * FROM user_payment_data WHERE id = ?";
                        $stmt = mysqli_prepare($conn, $sql);
                        mysqli_stmt_bind_param($stmt, "i", $user['id']);
                        mysqli_stmt_execute($stmt);
                        $result = mysqli_stmt_get_result($stmt);
                    
                        if ($result && mysqli_num_rows($result) == 1) {
                            $userPaymentData = mysqli_fetch_assoc($result);
                            $_SESSION['user_payment_balance'] = $userPaymentData['user_payment_balance'];
                            $_SESSION['user_bank_name'] = $userPaymentData['user_payment_bankname'];
                            $_SESSION['user_card_number'] = $userPaymentData['user_payment_cardnumber'];
                            $_SESSION['user_card_name'] = $userPaymentData['user_payment_cardname'];
                            $_SESSION['user_card_expiry_date'] = $userPaymentData['user_payment_cardexpdate'];
                        }

                        error_log("User ID: " . $user['id']);
                        error_log("SQL Query: " . $sql);
                        error_log("Query result: " . ($result ? "Success" : "Failure"));
                        error_log("Number of rows: " . mysqli_num_rows($result));
                        error_log("User payment data: " . print_r($userPaymentData, true));
                        error_log("Login successful for user: " . $user['username']);
                        outputJSON(['status' => 'success', 'message' => 'Login successful']);

                    } else {
                        error_log("Login failed: Invalid credentials for user: $userInput");
                        outputJSON(['status' => 'error', 'message' => 'Invalid username/email or password']);
                    }
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
        
        if (filter_var($forgot_email, FILTER_VALIDATE_EMAIL)) {
            $sql = "SELECT * FROM user_account_data WHERE user_email = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "s", $forgot_email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
            
            if ($result && mysqli_num_rows($result) == 1) {
                $user = mysqli_fetch_assoc($result);
                $verification_code = rand(100000, 999999);
                
                $sql = "UPDATE user_account_data SET user_verification_code = ? WHERE user_email = ?";
                $stmt = mysqli_prepare($conn, $sql);
                mysqli_stmt_bind_param($stmt, "ss", $verification_code, $forgot_email);
                mysqli_stmt_execute($stmt);
                
                outputJSON([
                    'status' => 'success',
                    'message' => 'Verification code has been generated.',
                    'verification_code' => $verification_code,
                    'user_email' => $forgot_email
                ]);
            } else {
                outputJSON([
                    'status' => 'error',
                    'message' => 'No account found with email: ' . htmlspecialchars($forgot_email)
                ]);
            }
        } else {
            outputJSON([
                'status' => 'error',
                'message' => 'Invalid email format. Please enter a valid email address.'
            ]);
        }
        exit();
    }

    // Reset password validation
    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['verification-code']) && isset($_POST['new-password'])) {
        $verification_code = $_POST['verification-code'];
        $new_password = $_POST['new-password'];
        
        // error_log("Attempting to reset password. Verification code: $verification_code, New password length: " . strlen($new_password));
        
        // Check if the verification code is valid
        $sql = "SELECT * FROM user_account_data WHERE user_verification_code = ?";
        $stmt = mysqli_prepare($conn, $sql);
        mysqli_stmt_bind_param($stmt, "s", $verification_code);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        
        // error_log("Query executed. Number of rows: " . mysqli_num_rows($result));
        
        if ($result && mysqli_num_rows($result) == 1) {
            $user = mysqli_fetch_assoc($result);
            // error_log("User found: " . $user['user_email']);
            
            $sql = "UPDATE user_account_data SET user_password = ? WHERE user_email = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "ss", $new_password, $user['user_email']);
            mysqli_stmt_execute($stmt);
            
            $reset_message = "Password reset successful. You can now log in with your new password.";
            outputJSON(['status' => 'success', 'message' => $reset_message]);

            // $sql = "UPDATE user_account_data SET user_verification_code = NULL WHERE user_email = ?";
            // $stmt = mysqli_prepare($conn, $sql);
            // mysqli_stmt_bind_param($stmt, "s", $user['user_email']);

            echo "<script>alert('$reset_message');</script>";
        } else {
            $reset_message = "Invalid verification code. Please try again.";
            outputJSON(['status' => 'error', 'message' => $reset_message]);
            echo "<script>alert('$reset_message');</script>";
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
                <form id="forgot-password-form" method="post">
                    <input type="email" name="forgot-email" id="reset-email-input" placeholder="Enter your email">
                    <button type="submit" id="get-verification-code">Get Verification Code</button>
                </form>
            </div>
            <div id="verification-container" style="display: none;">
                <form id="vertification-form" method="post">
                    <input type="text" name="verification-code" id="verification-code-input" placeholder="Enter verification code">
                    <div id="verification-error" style="color: red; display: none;"></div>
                    <button type="submit" id="submit-verification">Submit</button>
                </form>
            </div>
            <div id="new-password-container" style="display: none;">
                <p id="reset-email-display"></p>
                <input type="password" name="new-password" id="new-password-input" placeholder="Enter new password">
                <button type="submit" id="submit-new-password">Reset Password</button>
            </div>
            <div id="countdown" style="display: none;"></div>
        </div>
    </div>

    <script src="assets/javascript/index.js"></script>
    </body>
</html>