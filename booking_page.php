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
    <link rel="stylesheet" href="assets/css/booking_page.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
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

    <main>
        <div id="map-container">
            <div id="map"></div>
            <div class="map-gradient"></div>
        </div>
        <div id="booking-panel">
            <div id="location-inputs">
                <div class="input-group">
                    <label for="from"><i class="fas fa-map-marker-alt" style="color: #74C0FC;"></i> From</label>
                    <input type="text" id="from" placeholder="Enter pickup location">
                </div>
                <div class="exchange-icon"><i class="fas fa-exchange-alt"></i></div>
                <div class="input-group">
                    <label for="to"><i class="fas fa-map-marker-alt" style="color: #fe3939;"></i> To</label>
                    <input type="text" id="to" placeholder="Enter destination">
                </div>
            </div>
            <div id="booking-details">
                <div id="car-options"></div>
                <div id="booking-details-info">
                    <div id="payment-method">
                        <label for="payment">Payment Method</label>
                        <select id="payment">
                            <option value="cash">Cash</option>
                            <option value="credit-debit-card">Credit/Debit Card</option>
                            <option value="e-wallet">E-wallet</option>
                            <option value="mycar-wallet">MyCar Wallet</option>
                        </select>
                    </div>
                    <button id="notes" class="notes-button" data-notes-button>Add notes for driver <i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        </div>
        <div class="booking-buttons">
            <button id="ride-now">Ride Now</button>
            <button class="calendar-icon" id="calendar-button" data-calendar-button><i id="calendar-button-icon" class="fas fa-calendar-alt" style="color: #ffffff;"></i></button>
        </div>
    </main>

    <div id="search-container" class="hidden">
        <div id="search-popup">
            <input type="text" id="search-input" placeholder="Search for a location">
            <div id="search-results"></div>
        </div>
    </div>

    <!-- For the notes functionality -->
    <div id="notes-container" class="hidden">
        <div id="notes-popup">
            <h2>Add Notes for Driver</h2>
            <p>Got any special requests for the driver? Let 'em know !</p>
            <textarea id="notes-input" rows="4" cols="50" placeholder="Write down your request here... •ᴗ•"></textarea>
            <div class="notes-btn">
                <button id="send-notes">Send</button>
                <button id="cancel-notes">Cancel</button>
            </div>
        </div>
    </div>

    <!-- For the calendar functionality -->
    <div id="calendar-container" class="hidden">
        <div id="calendar-popup">
            <h2>Schedule Your Ride</h2>
            <p>Select Date and Time</p>
            <div id="calendar-input">
                <input type="date" id="trip-date">
                <input type="time" id="trip-time">
            </div>
            <div class="calendar-btn">
                <button id="confirm-datetime">Confirm</button>
                <button id="close-calendar">Close</button>
            </div>
        </div>
    </div>

    <div id="loading-popup" class="loading-popup hidden">
        <div class="loading-content">
            <div class="spinner"></div>
            <p>Processing your ride request and transaction...</p>
        </div>
    </div>

    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-rotatedmarker/leaflet.rotatedMarker.js"></script>
    <script src="./assets/javascript/booking_page.js"></script>
    <script src="./assets/javascript/darkmode.js"></script>
</body>
</html>
    