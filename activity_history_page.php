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
    <link rel="stylesheet" href="assets/css/activity_history_page.css">
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
        <aside>
            <h2 class="activity-title">Activity</h2>
            <ul class="activity-menu">
                <li class="active-menu"><a href="activity_activenow_page.php"><i class="fas fa-clock"></i> Active Now</a></li>
                <li class="history-menu"><a href="#"><i class="fas fa-history"></i> History</a></li>
            </ul>
        </aside>
        <section class="content">
            <h2>History</h2>
            <input type="text" placeholder="Search history" class="search-bar">
            <div class="history-list">
                <h3>Yesterday</h3>
                <div class="history-item" data-order-id="135743">
                    <img src="./assets/css/pic/Mycar_car.png" alt="Economy car">
                    <div class="trip-details">
                        <h4>Economy car</h4>
                        <p>APU → Pavilion Bukit Jalil</p>
                    </div>
                    <span class="trip-time">6:31 p.m.</span>
                </div>
                <h3>02 March 2024</h3>
                <div class="history-item" data-order-id="135742">
                    <img src="./assets/css/pic/Mycar_car.png" alt="Economy car">
                    <div class="trip-details">
                        <h4>Economy car</h4>
                        <p>KLIA → Pavilion Bukit Jalil</p>
                    </div>
                    <span class="trip-time-second">4:29 p.m.</span>
                </div>
            </div>
        </section>

        <section class="details">
            <div class="details-title">
                <h2>Details</h2>
                <div class="back-button"><i class="fas fa-times"></i></div>
            </div>
            <div class="details-content"></div>
        </section>
    </main>

    <script src="./assets/javascript/activity_history_page.js"></script>
    <script src="./assets/javascript/darkmode.js"></script>
</body>
</html>