const loginForm = document.getElementById('login-form');
const userInput = document.getElementById('user-input');
let passwordInput = document.getElementById('password-input');
const signInButton = document.getElementById('sign-in-button');
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
const userError = document.getElementById('user-error');
const passwordError = document.getElementById('password-error');

[userError, passwordError].forEach(error => {
    error.style.color = 'red';
    error.style.fontSize = '12px';
    error.style.marginTop = '5px';
    error.style.marginBottom = '5px';
    error.style.display = 'none';
});

userInput.parentNode.insertBefore(userError, userInput.nextSibling);
passwordInput.parentNode.insertBefore(passwordError, passwordInput.nextSibling);


document.addEventListener('DOMContentLoaded', function () {
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

    const loginForm = document.getElementById('login-form');
    const userInput = document.getElementById('user-input');
    const passwordInput = document.getElementById('password-input');
    const signInButton = document.getElementById('sign-in-button');
    const userError = document.getElementById('user-error');
    const passwordError = document.getElementById('password-error');

    let isPasswordVisible = false;

    // Handle submitting the login form
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const userValue = userInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Clear previous error messages
        userError.textContent = '';
        passwordError.textContent = '';

        if (!userValue) {
            userError.textContent = 'Please enter a username or email address.';
            return;
        }

        const formData = new FormData();
        formData.append('userInput', userValue);

        if (!isPasswordVisible) {
            // First step: Check if user exists
            formData.append('action', 'checkUser');
        } else {
            // Second step: Attempt login with password
            if (!passwordValue) {
                passwordError.textContent = 'Please enter your password.';
                return;
            }
            formData.append('action', 'login');
            formData.append('password', passwordValue);
        }

        fetch('index.php', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    if (!isPasswordVisible) {
                        // User exists, show password field
                        passwordInput.style.display = 'block';
                        isPasswordVisible = true;
                        signInButton.textContent = 'Sign in';
                    } else {
                        // Password validated, redirect to main page
                        window.location.href = 'main_page.php';
                    }
                } else {
                    // Handle login failure
                    const errorMessage = data.message || 'An error occurred. Please try again.';
                    if (!isPasswordVisible) {
                        userError.textContent = errorMessage;
                    } else {
                        passwordError.textContent = errorMessage;
                    }
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                const errorMessage = 'An error occurred. Please try again later.';
                if (!isPasswordVisible) {
                    userError.textContent = errorMessage;
                } else {
                    passwordError.textContent = errorMessage;
                }
            });
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
});
