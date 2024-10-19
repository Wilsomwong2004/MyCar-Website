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
    <link rel="stylesheet" href="assets/css/main_page.css">
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

    <div class="map-container">
        <div id="map"></div>
        <div class="map-overlay"></div>
        <div class="search-container">
            <input type="text" id="search-input" placeholder="Search for places...">
            <button id="search-button"><i class="fas fa-search"></i></button>
            <button class="mic-icon"><i class="fas fa-microphone"></i></button>
            <button class="star-icon"><i class="fas fa-star"></i></button>
        </div>
        <div class="filter-buttons">
            <button><i class="fas fa-utensils"></i> Restaurant</button>
            <button><i class="fas fa-shopping-cart"></i> Shopping</button>
            <button class="petrol-button"><i class="fas fa-gas-pump"></i> Petrol</button>
            <button><i class="fas fa-car"></i> Car Service</button>
        </div>
    </div>

    <div class="favorites-container"></div>
    <div id="place-details" class="place-details-container"></div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
    <script src="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.js" charset="utf-8"></script>
    <script src="assets/javascript/main_page.js"></script>
    <script src="assets/javascript/darkmode.js"></script>
    
</body>
</html>
