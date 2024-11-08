<?php
    session_start();
    if(!isset($_SESSION['user_email'])) {
        header("Location: index.php");
        exit();
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyCar</title>
    <link rel="stylesheet" href="assets/css/done_booking_page.css">
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
            <a href="#" id="home-button"><i class="fas fa-home"></i> Home</a>
            <a href="message_page.php" id="messages-button"><i class="fas fa-comment"></i> Messages</a>
            <a href="activity_activenow_page.php" id="activity-button"><i class="fas fa-bell"></i> Activity</a>
            <a href="wallet_page.php" id="wallet-button"><i class="fas fa-wallet"></i> Wallet</a>
            <a href="settings_page.php" id="settings-button"><i class="fas fa-cog"></i> Settings</a>
        </div>
        <div class="profile">
            <img src="<?php echo $_SESSION['user_profile_pic']; ?>" alt="Profile" id="profile-pic">
            <div class="header-right">
                <button id="hamburger-menu" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <div class="profile-dropdown" id="profile-dropdown">
                <div class="profile-info">
                    <img src="<?php echo $_SESSION['user_profile_pic']; ?>" alt="<?php echo $_SESSION['user_username']; ?>">
                    <div>
                        <h3><?php echo $_SESSION['user_username']; ?></h3>
                        <p><?php echo $_SESSION['user_email']; ?></p>
                    </div>
                </div>
                <ul>
                    <li><a href="settings_page.php" class="settings-profile"><i class="fas fa-cog"></i>Settings</a></li>
                    <li>
                    <i class="fas fa-moon"></i> Dark Mode
                    <label class="switch">
                        <input type="checkbox" name="dark-mode-toggle" id="dark-mode-toggle">
                        <span class="slider round"></span>
                    </label>
                    </li>
                    <li><a href="faq_page.php" class="help-center-profile"><i class="fas fa-question-circle"></i>Help </a></li>
                    <li class="logout-profile" id="logout-profile"><i class="fas fa-sign-out-alt"></i> Logout</li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="content">
        <div class="done-booking">
            <img src="assets/css/pic/Congratulations pic.png" alt="Congratulations pic">
        </div>
        <div class="done-booking-text">
            <h3>YEEPIE !</h3>
            <p>Your Driver will be arrived soon!</p>
        </div>
        <div class="details of drtivers"></div>
        <div class="done-booking-btn">
            <button id="done-booking-btn">Done</button>
        </div>
    </div>
    
    <script src="./assets/javascript/done_booking_page.js"></script>
    <script src="./assets/javascript/darkmode.js"></script>
</body>
</html>