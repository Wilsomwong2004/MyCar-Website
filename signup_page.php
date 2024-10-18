<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyCar</title>
    <link rel="stylesheet" href="./assets/css/signup_page.css"/>
    <br/>
</head>

<body>
    <div class="create_acc_container">
        <div class="create_acc_left">
            <div class="create_acc_left_details">
                <img src="./assets/css/pic/mycarlogo_light.png" alt="MyCar Logo" class="mycarlogo-image"/>
                <p>"Ride Easy, Ride Smart"</p>
            </div>
        </div>

        
        <div class="create_acc_right">
            <div class="create_acc_right_details">
                <!-- ADD PHP HERE -->
                <!-- <form id="createAccountForm" action=".php"> -->
                <form id="createAccountForm" action="insert.php" method="post">
                    <h2>Create New Account</h2>
                    <p>Enter your details to sign in to the website</p>
                    <div class="create_acc_right_name_input">
                        <input
                            type="text"
                            name="first_user_name"
                            id="first_name"
                            placeholder="First Name"
                            required
                        />
                        <input
                            type="text"
                            name="last_user_name"
                            id="last_name"
                            placeholder="Last Name"
                            required
                        />
                    </div>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter New Username"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter New Password"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your Email"
                        required
                    />
                    <input 
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Address"
                        required
                    />
                    <input 
                        type="date"
                        id="birthday"
                        name="birthday"
                        placeholder="Birthday"
                        required
                    />
                    
                    <div class="create_acc_gender">
                        Gender:
                        <input type="radio" name="gender" value="Male"> Male
                        <input type="radio" name="gender" value="Female"> Female
                        <input type="radio" name="gender" value="Other"> Other
                    </div>

                    <!--HYPERLINK THE TnC-->
                    <div class="agree_w_tnc_container">
                        <input class="agree_w_tnc"
                        type="checkbox"
                        name="agree_w_tnc"
                        value="agree_w_tnc"
                        placeholder="I hereby agree with the Terms & Conditions of MyCar"
                        required
                        />
                        <p>I hereby agree with the <a href="terms_services.php">Terms & Conditions</a> of MyCar</p>
                        <!--HYPERLINK THE TnC-->
                    </div>

                    <button id="create_new_acc_btn" type="submit">Create New Account</button>
                    <button id="login_page_btn" type="button"><a href="index.php">Return to Login Page</a></button>
                </form>
            </div>
        </div>
    </div>

    <div id="confirmPopup" class="popup hidden">
        <div class="popup-content">
            <!-- <span class="close">&times;</span> -->
            <h2>Set Up Payment</h2>
            <p>Do you want to set up your payment now?</p>
            <p class="subtext">You can set it up later in the settings page.</p>
            <div class="button-container">
                <button id="setupLater" class="popup-button secondary">Set Up Later</button>
                <button id="setupNow" class="popup-button primary">Set Up Now</button>
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="./assets/javascript/signup_page.js"></script>
</body>
</html>

