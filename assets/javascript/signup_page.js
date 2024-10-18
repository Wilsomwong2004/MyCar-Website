document.addEventListener('DOMContentLoaded', function () {
    //signup page javascript
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const form = document.getElementById('createAccountForm');
    const termsCheckbox = document.querySelector('input[name="agree_w_tnc"]');
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    const createAccountButton = document.getElementById('create_new_acc_btn');
    const closeModal = document.querySelector('.close');
    const addressInput = document.getElementById('address');
    const birthdayInput = document.getElementById('birthday');
    const confirmPopup = document.getElementById('confirmPopup');
    const yesButton = confirmPopup.querySelector('button:nth-child(1)');
    const noButton = confirmPopup.querySelector('button:nth-child(2)');

    //valiation for email and password and gender, address and birthday, firstname, lastname, nenw username, and password
    function validateForm() {
        if (emailInput.validity.valid && passwordInput.validity.valid && genderInputs.length > 0 && addressInput.validity.valid && birthdayInput.validity.valid) {
            if (genderInputs[0].checked || genderInputs[1].checked || genderInputs[2].checked) {
                return true;
            } else {
                alert('Please select your gender');
                return false;
            }

        } else {
            alert('Please fill all required fields');
            return false;
        }
    }

    //when click on create account form
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (validateForm()) {
            const formData = new FormData(form);

            fetch('insert.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(text => {
                    try {
                        return JSON.parse(text);
                    } catch (error) {
                        console.error('Server response:', text);
                        throw new Error('Invalid JSON response from server');
                    }
                })
                .then(data => {
                    if (data.status === 'success') {
                        alert('Account created successfully!');
                        confirmPopup.classList.remove('hidden');
                    } else {
                        console.error('Server error:', data.message, data.details);
                        alert('Error: ' + data.message + '\n\nCheck the console for more details.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred. Please check the console for more details.');
                });
        }
    });

    yesButton.addEventListener('click', function () {
        confirmPopup.classList.add('hidden');
        window.location.href = 'main_page.php';
    });

    noButton.addEventListener('click', function () {
        confirmPopup.classList.add('hidden');
        window.location.href = 'add_card_page.php';
    });

    closeModal.onclick = function () {
        confirmPopup.classList.add('hidden');
    }

});