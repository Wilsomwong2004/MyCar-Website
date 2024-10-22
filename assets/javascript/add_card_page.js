document.addEventListener('DOMContentLoaded', function () {
    const cardForm = document.getElementById('add_card_btn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const setupLater = document.getElementById('setupLater');
    const bankName = document.getElementById('bank_name');
    const cardNumber = document.getElementById('number_on_card');
    const cardName = document.getElementById('name_on_card');
    const cardExpiry = document.getElementById('card_expiration_date');
    const cardCvv = document.getElementById('card_cvv_number');
    const cardPassword = document.getElementById('password');
    const confirmPopup = document.getElementById('confirmPopup');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const loading_text = document.getElementsByClassName('loading-text');
    const term_condition = document.getElementsByClassName('agree_w_tnc');

    // Add event listener for card number input
    cardNumber.addEventListener('blur', function () {
        if (cardNumber.value.trim().length === 16) {
            checkDuplicateCard(cardNumber.value.trim());
        }
    });

    function checkDuplicateCard(cardNumber) {
        const formData = new FormData();
        formData.append('number_on_card', cardNumber);
        formData.append('user_id', getUserId());

        fetch('check_duplicate_card.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.exists) {
                    alert('This card is already registered with your account. Please use a different card.');
                    document.getElementById('number_on_card').value = '';
                    document.getElementById('number_on_card').focus();
                }
            })
            .catch(error => {
                console.error('Error checking duplicate card:', error);
            });
    }

    function validateForm() {
        // Check if all fields are filled
        if (bankName.value.trim() === '' ||
            cardNumber.value.trim() === '' ||
            cardName.value.trim() === '' ||
            cardExpiry.value.trim() === '' ||
            cardCvv.value.trim() === '') {
            alert('Please fill in all required fields.');
            return false;
        }

        // Check if the card number is valid
        if (!/^\d{16}$/.test(cardNumber.value.trim())) {
            alert('Please enter a valid 16-digit card number.');
            return false;
        }

        // Check if the card expiry date is valid
        if (!/^\d{2}\/\d{2}$/.test(cardExpiry.value.trim())) {
            alert('Please enter a valid card expiration date (MM/YY).');
            return false;
        }

        // Check if the card CVV number is valid
        if (!/^\d{3}$/.test(cardCvv.value.trim())) {
            alert('Please enter a valid card CVV number.');
            return false;
        }

        if (term_condition[0].checked === false) {
            alert('Please agree to the terms and conditions.');
            return false;
        }

        return true;
    }

    // Handle form submission
    cardForm.addEventListener('click', function (e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        loadingOverlay.style.display = 'flex';

        const formData = new FormData();
        formData.append('bank_name', bankName.value);
        formData.append('number_on_card', cardNumber.value);
        formData.append('name_on_card', cardName.value);
        formData.append('card_expiration_date', cardExpiry.value);
        formData.append('card_cvv_number', cardCvv.value);
        formData.append('card_password', cardPassword.value);
        formData.append('user_id', getUserId());

        fetch('insert_card_details.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    // Loading sequence
                    setTimeout(() => {
                        loading_text[0].innerHTML = "Adding your card information...";
                    }, 0);
                    setTimeout(() => {
                        loading_text[0].innerHTML = "Saving your card details to our servers...";
                    }, 2000);
                    setTimeout(() => {
                        loading_text[0].innerHTML = "Almost done... Take a coffee break before we're finished.";
                    }, 6000);
                    setTimeout(() => {
                        loading_text[0].innerHTML = "Done saving. Redirecting to the back page...";
                    }, 10000);

                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                        window.location.href = 'main_page.php';
                    }, 12000);
                } else {
                    alert('Error: ' + data.message);
                    loadingOverlay.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while saving your card details.');
                loadingOverlay.style.display = 'none';
            });
    });

    // Handle "Setup Later" button click
    setupLater.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default behavior (e.g., page navigation)
        confirmPopup.style.display = 'flex'; // Show the confirmation popup
    });

    // Handle "Yes" click in the confirmation popup
    confirmYes.addEventListener('click', function () {
        confirmPopup.style.display = 'none';
        // Redirect to the main page
        window.location.href = 'main_page.php';
    });

    // Handle "No" click in the confirmation popup
    confirmNo.addEventListener('click', function () {
        confirmPopup.style.display = 'none';
    });

    function getUserId() {
        // Check if the user's ID is stored in the session
        if (sessionStorage.getItem('userId')) {
            return sessionStorage.getItem('userId');
        }
        // If not in the session, check if it's stored in localStorage
        else if (localStorage.getItem('userId')) {
            return localStorage.getItem('userId');
        }
        // If not found in either session or localStorage, fetch the user's ID from the server
        else {
            // Make an AJAX request to the server to retrieve the user's ID
            return fetchUserId();
        }
    }

    function fetchUserId() {
        // Make an AJAX request to the server to retrieve the user's ID
        return new Promise((resolve, reject) => {
            fetch('get_user_id.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Store the user's ID in the session and localStorage
                        sessionStorage.setItem('userId', data.userId);
                        localStorage.setItem('userId', data.userId);
                        resolve(data.userId);
                    } else {
                        reject('Error fetching user ID: ' + data.message);
                    }
                })
                .catch(error => {
                    reject('Error fetching user ID: ' + error);
                });
        });
    }
});