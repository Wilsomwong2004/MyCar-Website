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
            confirmPopup.classList.remove('hidden');
        } else {
            confirmPopup.classList.add('hidden');
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