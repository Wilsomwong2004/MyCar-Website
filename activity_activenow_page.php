<?php
    session_start();
    if(!isset($_SESSION['email'])) {
        header("Location: index.php");
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyCar</title>
    <link rel="stylesheet" href="assets/css/activtiy_activenow_page.css">
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
            <a href="#" id="activity-button"><i class="fas fa-bell"></i> Activity</a>
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

    <main>
        <aside>
            <h2 class="activity-title">Activity</h2>
            <ul class="activity-menu">
                <li class="active-menu"><a href="#"><i class="fas fa-clock"></i> Active Now</a></li>
                <li class="history-menu"><a href="activity_history_page.php"><i class="fas fa-history"></i> History</a></li>
            </ul>
        </aside>
        <div class="content">
            <div id="back-button" class="back-button hidden">
                <i class="fas fa-chevron-left"></i> Back
            </div>
            <h2 id="content-title">Active Now</h2>
            <div id="active-now-content" class="active">
                <div class="map-container">
                    <div id="map-container"></div>
                    <div class="trip-info">
                        <center>
                            <h1>Oops! There seems to be an issue.</h1>
                            <p>Feature currently in development. Check back soon!</p>
                        </center>
                    </div>
                </div>
            </div>
            <div id="history-content" class="hidden">
                <!-- Add history content here -->
                <p>Your trip history will be displayed here.</p>
            </div>
        </div>

        <!--
        <section id="active-now-section">
            <h2>Active Now</h2>
            <div id="map-container"></div>
            <div id="ride-info-container"></div>
        </section>
        -->
        
    </main>

    <script src="./assets/javascript/activtiy_activenow_page.js"></script>
    <script src="./assets/javascript/darkmode.js"></script>
</body>
</html>