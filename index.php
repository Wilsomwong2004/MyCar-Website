<?php
session_start();
include "conn.php";

$login_error = '';
$reset_message = '';


// Login validation
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['userInput']) && isset($_POST['password'])) {
    $userInput = $_POST['userInput'];  // This can be either email or username
    $password = $_POST['password'];
    
    // Check if the input is a valid email or username
    if (filter_var($userInput, FILTER_VALIDATE_EMAIL)) {
        // User input is an email
        $sql = "SELECT * FROM user_account_data WHERE user_email = '$userInput'";
    } else {
        // User input is a username
        $sql = "SELECT * FROM user_account_data WHERE user_username = '$userInput'";
    }
    
    $result = mysqli_query($dbConn, $sql);
    
    if ($result && mysqli_num_rows($result) == 1) {
        $user = mysqli_fetch_assoc($result);
        // Verify password
        if (password_verify($password, $user['user_password'])) {
            // If the password is correct, create session and redirect
            $_SESSION['user_email'] = $user['user_email'];
            echo 'success';  // This response is captured in JavaScript
        } else {
            $login_error = "Invalid username/email or password";
            echo $login_error;
        }
    } else {
        $login_error = "Invalid username/email or password";
        echo $login_error;
    }
    exit();
}

// Password reset
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['reset_email']) && isset($_POST['new_password'])) {
    $email = $_POST['reset_email'];
    $new_password = $_POST['new_password'];
    
    // Hash the new password
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    
    $sql = "UPDATE user_account_data SET user_password = '$hashed_password' WHERE user_email = '$email'";
    if (mysqli_query($dbConn, $sql)) {
        $reset_message = "Password updated successfully";
        echo $reset_message;
    } else {
        $reset_message = "Error updating password: " . mysqli_error($dbConn);
        echo $reset_message;
    }
    exit();
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
                <form class="sign-in-forms" method="post" action="insert.php">
                    <input type="text" name='userInput' id="user-input" placeholder="Enter your username or email" required></input>
                    <input type="password" name='password' id="password-input" placeholder="Enter your password" style="display: none" required></input>
                    <input type="submit" value="Sign in with email" id="sign-in-with-email">
                    <!-- <button id="sign-in-with-email">Sign in with email</button> -->
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