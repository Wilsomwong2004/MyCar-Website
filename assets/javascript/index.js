const loginForm = document.getElementById('login-form');
const userInput = document.getElementById('email-input');
let passwordInput = document.getElementById('password-input');
const signInButton = document.getElementById('sign-in-with-email');
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const closeModal = document.querySelector('.modal .close');
const getVerificationCodeButton = document.getElementById('get-verification-code');
const verificationCodeInput = document.getElementById('verification-code-input');
const submitVerificationButton = document.getElementById('submit-verification');
const countdownElement = document.getElementById('countdown');
const resetEmailInput = document.getElementById('reset-email-input');
const verificationError = document.getElementById('verification-error');
const newPasswordContainer = document.getElementById('new-password-container');
const resetEmailDisplay = document.getElementById('reset-email-display');
const newPasswordInput = document.getElementById('new-password-input');
const submitNewPasswordButton = document.getElementById('submit-new-password');
const resetEmailContainer = document.getElementById('reset-email-container');
const verificationContainer = document.getElementById('verification-container');

let verificationCode = '';
let countdownTimer;
let expiryTimer;

// Create error message elements
const userError = document.createElement('div');
const passwordError = document.createElement('div');

[userError, passwordError].forEach(error => {
    error.style.color = 'red';
    error.style.fontSize = '12px';
    error.style.marginTop = '5px';
    error.style.marginBottom = '5px';
    error.style.display = 'none';
});

userInput.parentNode.insertBefore(userError, userInput.nextSibling);
passwordInput.parentNode.insertBefore(passwordError, passwordInput.nextSibling);

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate username format
function isValidUsername(username) {
    // This is a simple example. Adjust the regex based on your username requirements
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}

// Function to check if password is entered
function isPasswordEntered() {
    return passwordInput.value.trim() !== '';
}

// Mock function to check if credentials are correct (replace with actual authentication logic)
function areCredentialsCorrect(user, password) {
    // This is a placeholder. In a real app, you'd check against a server or secure storage
    return password === 'correctpassword';
}

let isPasswordVisible = false;

// Handle sign in button click
signInButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Always validate user input first
    const userValue = userInput.value.trim();
    if (!userValue) {
        userError.textContent = 'Please enter a username or email address.';
        userError.style.display = 'block';
        return;
    }

    let isValidUser = isValidEmail(userValue) || isValidUsername(userValue);
    if (!isValidUser) {
        userError.textContent = 'Please enter a valid username or email address.';
        userError.style.display = 'block';
        return;
    }

    // User input is valid, hide any existing error
    userError.style.display = 'none';

    if (!isPasswordVisible) {
        // First valid user entry: Show password input
        passwordInput.style.display = 'block';
        signInButton.textContent = 'Sign In';
        isPasswordVisible = true;
    } else {
        // Password is visible, so validate it
        if (!isPasswordEntered()) {
            passwordError.textContent = 'Please input the password.';
            passwordError.style.display = 'block';
        } else if (!areCredentialsCorrect(userValue, passwordInput.value)) {
            passwordError.textContent = 'Incorrect username/email or password. Please try again.';
            passwordError.style.display = 'block';
        } else {
            // Both user input and password are valid
            passwordError.style.display = 'none';
            console.log('Logging in with:', userValue, 'password:', passwordInput.value);
            // Here you would typically send the login request to your server
        }
    }
});

// Hide error messages when user starts typing
userInput.addEventListener('input', () => {
    userError.style.display = 'none';
});

passwordInput.addEventListener('input', () => {
    passwordError.style.display = 'none';
});

// Update placeholder and labels
if (userInput) {
    userInput.placeholder = 'Enter username or email';
}

// Forgot password functionality
forgotPasswordLink.onclick = function (e) {
    e.preventDefault();
    forgotPasswordModal.style.display = 'block';
}

closeModal.onclick = function () {
    forgotPasswordModal.style.display = 'none';
    resetModalState();
}

window.onclick = function (event) {
    if (event.target == forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
        resetModalState();
    }
}

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function startCountdown() {
    let timeLeft = 60;
    countdownElement.style.display = 'block';
    getVerificationCodeButton.style.display = 'none';

    countdownTimer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            countdownElement.innerHTML = '<a href="#" id="resend-code">Get Verification code again</a>';
            document.getElementById('resend-code').onclick = resendVerificationCode;
        } else {
            countdownElement.textContent = `Resend code in ${timeLeft}s`;
        }
        timeLeft -= 1;
    }, 1000);
}

function resendVerificationCode(e) {
    e.preventDefault();
    clearInterval(countdownTimer);
    getVerificationCodeButton.style.display = 'none';
    countdownElement.style.display = 'none';
    verificationCode = generateVerificationCode();
    console.log('New verification code:', verificationCode); // In a real app, this would be sent to the user's email
    startCountdown();
}

function resetModalState() {
    clearInterval(countdownTimer);
    getVerificationCodeButton.style.display = 'block';
    countdownElement.style.display = 'none';
    verificationContainer.style.display = 'none';
    newPasswordContainer.style.display = 'none';
    resetEmailContainer.style.display = 'block';
    resetEmailInput.value = '';
    verificationCodeInput.value = '';
    newPasswordInput.value = '';
    verificationError.style.display = 'none';
    verificationCode = '';
}

getVerificationCodeButton.onclick = function () {
    const email = resetEmailInput.value.trim();
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    verificationCode = generateVerificationCode();
    console.log('Verification code:', verificationCode); // In a real app, this would be sent to the user's email
    verificationContainer.style.display = 'block';
    startCountdown();
}

submitVerificationButton.onclick = function () {
    if (verificationCodeInput.value === verificationCode) {
        verificationError.style.display = 'none';
        verificationContainer.style.display = 'none';
        newPasswordContainer.style.display = 'block';
        resetEmailDisplay.textContent = `Email: ${resetEmailInput.value}`;
        resetEmailContainer.style.display = 'none';
        clearInterval(countdownTimer);
        countdownElement.style.display = 'none';
    } else {
        verificationError.textContent = 'Verification code you entered is invalid. Please try again!';
        verificationError.style.display = 'block';
        verificationError.style.fontSize = '12px';
        verificationError.style.textAlign = 'center';
        verificationError.style.marginBottom = '14px';
    }
}

submitNewPasswordButton.onclick = function () {
    const newPassword = newPasswordInput.value.trim();
    if (newPassword) {
        // Here you would typically send the new password to your server
        alert('Password reset successfully!');
        forgotPasswordModal.style.display = 'none';
        resetModalState();
    } else {
        alert('Please enter a new password.');
    }
}
