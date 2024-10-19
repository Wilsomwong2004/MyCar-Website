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
    <title>MyCar - Messages</title>
    <link rel="stylesheet" href="assets/css/message_page.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar">
        <div class="logo">
            <img id="logo-image" src="assets/css/pic/mycarlogo1.png" alt="MyCar Logo">
        </div>
        <div class="nav-links" id="nav-links">
            <a href="main_page.php" id="home-button"><i class="fas fa-home"></i> Home</a>
            <a href="#" id="messages-button"><i class="fas fa-comment"></i> Messages</a>
            <a href="activity_activenow_page.php" id="activity-button"><i class="fas fa-bell"></i> Activity</a>
            <a href="wallet_page.php" id="wallet-button"><i class="fas fa-wallet"></i> Wallet</a>
            <a href="settings_page.php" id="settings-button"><i class="fas fa-cog"></i> Settings</a>
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
            <div class="profile-dropdown" id="profile-dropdown">
                <div class="profile-info">
                    <img src="assets/css/pic/Unknown_acc-removebg.png" alt="Jackson Low">
                    <div>
                    <h3>Jackson Low</h3>
                    <p>hello@jacksonlow.com</p>
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

    <div class="messages-container">
        <div class="chat-list">
            <h2>Messages</h2>
            <div class="search-bar">
                <input type="text" placeholder="Search chats">
                <i class="fas fa-search"></i>
            </div>
            <ul id="chat-list"></ul>
        </div>
        <div id="draggable-divider"></div>
        <div class="chat-window">
            <div class="chat-header">
                <img src="" alt="Contact" id="contact-image">
                <div class="contact-info">
                    <h3 id="contact-name"></h3>
                    <p id="contact-status"></p>
                </div>
                <button id="phone-button" class="action-button">
                    <i class="fas fa-phone"></i>
                </button>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="chat-input">
                <input type="text" placeholder="Enter your message" id="message-input">
                <button id ="emoji-button"><i class="far fa-smile"></i></button>
                <button id="attachment-button"><i class="fas fa-paperclip"></i></button>
                <button id="send-button"><i class="fas fa-paper-plane" id="send-icon"></i></button>
            </div>
        </div>
    </div>

    <div id="phone-popup" class="phone-popup">
        <div class="phone-popup-content">
            <h2>Contact Phone Number</h2>
            <p id="phone-number"></p>
            <button id="close-popup">Close</button>
        </div>
    </div>

    <script src="./assets/javascript/message_page.js"></script>
    <script src="./assets/javascript/darkmode.js"></script>
</body>
</html>