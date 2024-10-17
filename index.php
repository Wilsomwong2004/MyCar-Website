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
                <input type="email" id="email-input" placeholder="Enter your email" required></input>
                <input type="password" id="password-input" placeholder="Enter your password" style="display: none" required></input>
                <button id="sign-in-with-email">Sign in with email</button>
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