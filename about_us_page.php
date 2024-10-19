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
    <link rel="stylesheet" href="assets/css/about_us_page.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.0.7/countUp.umd.min.js"></script>
</head>
<body>
    <nav class="navbar">
        <div class="logo">
            <img id="logo-image" src="assets/css/pic/mycarlogo1.png" alt="MyCar Logo">
        </div>
        <div class="button">
            <a class="btn-primary">Go Back</a>
        </div>
    </nav>
    <div class="container">
        <center>
                <h1><b>About Us</b></h1>
        </center>
        <br>
        <div class="about-content">
            <center>
            <h2>MyCar</h2>
            </center>
            <p style="text-align: justify;">MyCar Asia is a Malaysian homegrown e-hailing ride application providing on demand passenger transport services across 13 major cities in Malaysia. Today, we have grown to commanding 15% market share of e-hailing rides in Malaysia, serving more than 1 million passengers a month. MyCar is owned by Platform Apps Sdn Bhd has been in the industry for about 2 years. MyCar has achieved number of over 100,000 drivers in all major cities and towns from MyCar Fleet and over 2 million MyCar passengers. </p>
        </div>

        <div class="vision-mission">
            <div class="vision">
                <center>
                <h3>VISION</h3>
                </center>
                <p style="text-align: justify;">Our vision is to be the leader of e-hailing provider and e-hailing preferred in the region. In our journey to achieve our mission to provide an affordable service, customer satisfaction and social corporate responsibility.</p>
            </div>
            <div class="mission">
                <center>
                <h3>MISSION</h3>
                </center>
                <p style="text-align: justify;">To provide a consistent, improved service and customer to be the talk of the town.</p>
            </div>
        </div>

        <div class="stats">
            <div class="stat-item">
                <h3 id="passengers">1,000,000</h3>
                <p>Passengers</p>
            </div>
            <div class="stat-item">
                <h3 id="drivers">56,000</h3>
                <p>Drivers</p>
            </div>
            <div class="stat-item">
                <h3 id="trips">3,557,612</h3>
                <p>Complete Trip</p>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.0.7/countUp.umd.min.js"></script>
    <script src="assets/javascript/darkmode.js"></script>
    <script src="assets/javascript/about_us_page.js"></script>
</body>
</html>