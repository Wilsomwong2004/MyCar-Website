<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyCar</title>
    <link rel="stylesheet" href="./assets/css/add_card_page.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <br/>
</head>

<body>
    <div class="add_card_container">
        <div class="add_card_left">
            <div class="card_info_container">
                <i class="fa-solid fa-wallet fa-beat-fade"></i>
                <p>A digital wallet simplifies the payment process by <br> offering fast, secure, and cashless transactions,<br> enhancing convenience for users.</p>
            </div>
        </div>
    
        <div class="add_card_right">
            <!-- ADD PHP HERE -->
            <!-- <form action=".php"> -->
            <h2>Add Credit/Debit Card</h2>
            <p>Enter details regarding your Credit/Debit card</p>
            <input
                type="text"
                id="bank_name"
                placeholder="Bank Name"
                required
            />
            <input
                type="number"
                id="number_on_card"
                placeholder="Number on Card"
                maxlength="16"
                minlength="16"
                required
            />
            <input
                type="text"
                id="name_on_card"
                placeholder="Name on Card"
                required
            />
            <input
                type="text"
                id="card_expiration_date"
                placeholder="Card Expiration Date (MM/YY)"
                pattern="\d{2}/\d{2}"
                required
                title="Please enter a date in MM/YY format"
            />
            <input
            type="number"
            id="card_cvv_number"
            placeholder="CVV"
            maxlength="3"
            required
            />
            <input
                type="password"
                id="password"
                placeholder="Enter Password"
                required
            />

            <!-- CREATE A TICK BOX FOR TnC AND "i ACKNOWLEDGE THAT MY INFORMATION IS SHARED"-->
            <!--HYPERLINK THE TnC-->
            <div class="agree_w_tnc_container">
                <input class="agree_w_tnc"
                type="checkbox"
                name="agree_w_tnc"
                value="agree_w_tnc"
                placeholder="I hereby agree with the Terms & Conditions of MyCar"
                required
                />
                <p>I hereby agree with the <a href="terms_service.php">Terms & Conditions</a> of MyCar</p>
            </div>
            

            <button id="add_card_btn" type="submit"" onclick="addCard()">Add Card</button>
            <button id="add_card_reset" type="reset" onclick="resetform()">Reset</button>
            <button id="setupLater">I want to set it up later.</button>
            </form>
        </div>
    </div>

    <div id="loadingOverlay" class="overlay hidden">
        <div class="popup-content">
            <div class="loader"></div>
            <p class="loading-text">Adding your card...</p>
        </div>
    </div>

    <div id="confirmPopup" class="popup hidden">
        <div class="popup-content">
            <p class="popup-text">Are you sure you want to set it up later? <br></p>
            <p class="popup-subtext">You can set it up later in setting page.</p>
            <button id="confirmYes">Yes</button>
            <button id="confirmNo">I change my mind</button>
        </div>
    </div>

    <script src="./assets/javascript/add_card_page.js"></script>
</body>
</html>

