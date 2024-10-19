
<?php
    session_start();
    if(!isset($_SESSION['email'])) {
        header("Location: login.php");
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyCar</title>
    <link rel="stylesheet" href="assets/css/settings_page.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.css" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="logo">
            <img id="logo-image" src="assets/css/pic/mycarlogo1.png" alt="MyCar Logo">
        </div>
        <div class="nav-links" id="nav-links">
            <a href="main_page.php" id="home-button"><i class="fas fa-home"></i> Home</a>
            <a href="message_page.php" id="messages-button"><i class="fas fa-comment"></i> Messages</a>
            <a href="activity_activenow_page.php" id="activity-button"><i class="fas fa-bell"></i> Activity</a>
            <a href="wallet_page.php" id="wallet-button"><i class="fas fa-wallet"></i> Wallet</a>
            <a href="#" id="settings-button"><i class="fas fa-cog"></i> Settings</a>
        </div>
        <div class="profile">
            <img src="assets/css/pic/Unknown_acc-removebg.png" alt="Profile" id="profile-pic">
            <div class="header-right">
                <button id="hamburger-menu" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <div class="profile-dropdown-miniprofile" id="profile-dropdown-miniprofile">
                <div class="profile-info-miniprofile">
                    <img src="assets/css/pic/Unknown_acc-removebg.png" alt="Jackson Low">
                    <div>
                    <h3>Jackson Low</h3>
                    <p>hello@jacksonlow.com</p>
                    </div>
                </div>
                <ul>
                    <li><a href="settings_page.php" class="settings-profile-miniprofile"><i class="fas fa-cog"></i>Settings</a></li>
                    <li>
                    <i class="fas fa-moon"></i> Dark Mode
                    <label class="switch-miniprofile">
                        <input type="checkbox" name="dark-mode-toggle" id="dark-mode-toggle">
                        <span class="slider-miniprofile"></span>
                    </label>
                    </li>
                    <li><a href="faq_page.php" class="help-center-profile"><i class="fas fa-question-circle"></i>Help </a></li>
                    <li class="logout-profile-miniprofile" id="logout-profile-miniprofile"><i class="fas fa-sign-out-alt"></i> Logout</li>
                </ul>
            </div>
        </div>
    </nav>
    
    <main>
        <h1>Settings</h1>
        <div class="log-out-button">Log Out <i class="fas fa-sign-out-alt"></i></div>

        <div class="profile-section">
            <img src="assets/css/pic/Unknown_acc-removebg.png" alt="Profile Picture" class="profile-pic">
            <div class="profile-info">
                <h2>Ariana Oliver</h2>
                <a href="#" class="change-photo">Change profile photo</a>
            </div>
        </div>
        <div class="profile-overlay"></div>
        <div class="settings-grid">
            <div class="settings-column">
                <h3>Account Settings</h3>
                <a href="#" id="change-username-password">Change username and password</a>
                <a href="add_card_page.php">Add a payment method</a>
                <label class="toggle">
                    <span>Two Factor Authentication</span>
                    <input type="checkbox" hidden>
                    <span class="slider"></span>
                </label>
                <a href="#" class="delete-account">Delete Account</a>
            </div>
            <div class="settings-column">
                <h3>General</h3>
                <a href="#" id='distance_units-select'>Distance units <span class="units-value">Kilometers</span></a>
                <label class="toggle">
                    <span>Dark mode</span>
                    <input type="checkbox" name="dark-mode-toggle" hidden>
                    <span class="slider"></span>
                </label>
                <label class="toggle">
                    <span>Push notifications</span>
                    <input type="checkbox" checked hidden>
                    <span class="slider"></span>
                </label>
                <a href="#" id="language-select">Language <span class="language-value">English</span></a>
                <a href="#" id="country-select">Country <span class="country-value">Malaysia</span></a>
            </div>
            <div class="settings-column">
                <h3>More</h3>
                <a href="about_us_page.php">About us</a>
                <a href="privacy_policy.php">Privacy policy</a>
                <a href="terms_service.php">Terms and conditions</a>
                <a href="faq_page.php">Frequently Asked Questions (FAQ)</a>
            </div>
        </div>
    </main>

    <!-- Popup container -->
    <div id="popup-container" class="popup-container">
        <div class="popup-content">
            <h2 id="popup-title"></h2>
            <div id="popup-body"></div>
        </div>
    </div>

    <div class="log-out-bottom">
        <button class="log-out-button-bottom">Log Out <i class="fas fa-sign-out-alt"></i></button>
    </div>
    <footer>
        <p>MyCar v1.0.1 | 2024</p>
    </footer>

    <script src="assets/javascript/settings_page.js"></script>
    <script src="assets/javascript/darkmode.js"></script>

</body>
</html>
