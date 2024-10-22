document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const userInput = document.getElementById('user-input');
    const passwordInput = document.getElementById('password-input');
    const signInButton = document.getElementById('sign-in-button');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const closeModal = document.querySelector('.modal .close');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const getVerificationCodeButton = document.getElementById('get-verification-code');
    const verificationForm = document.getElementById('vertification-form');
    const submitVerificationButton = document.getElementById('submit-verification');
    const countdownElement = document.getElementById('countdown');
    const resetEmailInput = document.getElementById('reset-email-input');
    const verificationCodeInput = document.getElementById('verification-code-input');
    const verificationError = document.getElementById('verification-error');
    const newPasswordContainer = document.getElementById('new-password-container');
    const resetEmailDisplay = document.getElementById('reset-email-display');
    const newPasswordInput = document.getElementById('new-password-input');
    const submitNewPasswordButton = document.getElementById('submit-new-password');
    const resetEmailContainer = document.getElementById('reset-email-container');
    const verificationContainer = document.getElementById('verification-container');
    const userError = document.getElementById('user-error');
    const passwordError = document.getElementById('password-error');

    let verificationCode = '';
    let countdownTimer;
    let expiryTimer;
    let isPasswordVisible = false;

    [userError, passwordError].forEach(error => {
        error.style.color = 'red';
        error.style.fontSize = '12px';
        error.style.marginTop = '5px';
        error.style.marginBottom = '5px';
        error.style.display = 'none';
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const userValue = userInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        userError.style.display = 'block';
        passwordError.style.display = 'block';
        userError.textContent = '';
        passwordError.textContent = '';

        if (!userValue) {
            userError.textContent = 'Please enter a username or email address.';
            return;
        }

        const formData = new FormData();
        formData.append('userInput', userValue);

        if (!isPasswordVisible) {
            formData.append('action', 'checkUser');
        } else {
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
                    // Show alert for user found
                    // alert(data.message);

                    if (!isPasswordVisible) {
                        passwordInput.style.display = 'block';
                        isPasswordVisible = true;
                        signInButton.textContent = 'Sign in';
                    } else {
                        if (data.redirect) {
                            window.location.href = data.redirect;
                        } else {
                            window.location.href = 'main_page.php';
                        }
                    }
                } else {
                    const errorMessage = data.message || 'An error occurred. Please try again.';
                    alert(errorMessage);
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
                alert(errorMessage);
                if (!isPasswordVisible) {
                    userError.textContent = errorMessage;
                } else {
                    passwordError.textContent = errorMessage;
                }
            });
    });

    forgotPasswordForm.onsubmit = function (e) {
        e.preventDefault();
        const email = resetEmailInput.value.trim();
        if (!email || !isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const formData = new FormData();
        formData.append('forgot-email', email);

        fetch('index.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Show the verification code in an alert
                    console.log(`Your verification code is: ${data.verification_code}`);
                    verificationContainer.style.display = 'block';
                    startCountdown();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('An error occurred. Please try again later.');
            });
    }

    // Hide error messages when user starts typing
    userInput.addEventListener('input', () => {
        userError.style.display = 'none';
    });

    passwordInput.addEventListener('input', () => {
        passwordError.style.display = 'none';
    });

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
        getVerificationCodeButton.style.display = 'block';
        countdownElement.style.display = 'none';
        verificationContainer.style.display = 'none';
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
    }

    forgotPasswordForm.onsubmit = function (e) {
        e.preventDefault();
        const email = resetEmailInput.value.trim();
        if (!email || !isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        const formData = new FormData();
        formData.append('forgot-email', email);

        fetch('index.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    verificationContainer.style.display = 'block';
                    startCountdown();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('An error occurred. Please try again later.');
            });
    }

    verificationForm.onsubmit = function (e) {
        e.preventDefault();
        const code = verificationCodeInput.value.trim();
        if (!code) {
            verificationError.textContent = 'Please enter the verification code.';
            verificationError.style.display = 'block';
            return;
        }

        const formData = new FormData();
        formData.append('verification-code', code);
        formData.append('new-password', ''); // Temporary placeholder

        fetch('index.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    verificationContainer.style.display = 'none';
                    newPasswordContainer.style.display = 'block';
                    clearInterval(countdownTimer);
                    countdownElement.style.display = 'none';
                } else {
                    verificationError.textContent = data.message;
                    verificationError.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                verificationError.textContent = 'An error occurred. Please try again later.';
                verificationError.style.display = 'block';
            });
    }

    submitNewPasswordButton.onclick = function () {
        const newPassword = newPasswordInput.value.trim();
        const verificationCode = verificationCodeInput.value.trim();

        if (!newPassword) {
            alert('Please enter a new password.');
            return;
        }

        const formData = new FormData();
        formData.append('verification-code', verificationCode);
        formData.append('new-password', newPassword);

        fetch('index.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    alert(data.message);
                    forgotPasswordModal.style.display = 'none';
                    resetModalState();
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert('An error occurred. Please try again later.');
            });
    }
});