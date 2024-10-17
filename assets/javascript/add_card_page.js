document.addEventListener('DOMContentLoaded', function () {
    const cardForm = document.getElementById('add_card_btn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const setupLater = document.getElementById('setupLater');
    const bankName = document.getElementById('bank_name');
    const cardNumber = document.getElementById('number_on_card');
    const cardName = document.getElementById('name_on_card');
    const cardExpiry = document.getElementById('card_expiration_date');
    const cardCvv = document.getElementById('card_cvv_number');
    const confirmPopup = document.getElementById('confirmPopup');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const loading_text = document.getElementsByClassName('loading-text');
    const term_condition = document.getElementsByClassName('agree_w_tnc');

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

        // Check if the card expiry date is valid date
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

        // Validate the form
        if (!validateForm()) {
            return;
        }

        // Show loading overlay
        loadingOverlay.style.display = 'flex';

        // Change the loading text in sequence
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
            loading_text[0].innerHTML = "Done saving. Redirecting to the main page...";
        }, 10000);

        // Hide the loading overlay and redirect after a delay
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
            // Redirect to the main page
            window.location.href = 'main_page.php';
        }, 12000); // Delay before redirection
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
});