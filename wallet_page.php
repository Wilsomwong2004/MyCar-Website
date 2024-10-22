<?php
  session_start();
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  ini_set('log_errors', 1);
  ini_set('error_log', 'php_errors.log');

  // Debug: Print session data
  // echo "<pre>Session Data:\n";
  // print_r($_SESSION);
  // echo "</pre>";

  error_log("Session data in wallet_page.php: " . print_r($_SESSION, true));

  if(!isset($_SESSION['user_email'])) {
      error_log("User not logged in. Redirecting to index.php");
      header("Location: index.php");
      exit();
  }

  if(!isset($_SESSION['user_id'])) {
      error_log("User ID not set in session for user: " . $_SESSION['user_email']);
      echo "Error: User ID not set in session. Please try logging in again.";
      exit();
  }

  // if (!isset($_SESSION['user_cards']) || empty($_SESSION['user_cards'])) {
  //   // Fetch the user's cards from the database
  //   $user_id = $_SESSION['user_id'];
  //   $sql = "SELECT * FROM user_payment_data WHERE id = ?";
  //   $stmt = $conn->prepare($sql);
  //   $stmt->bind_param("i", $user_id);
  //   $stmt->execute();
  //   $result = $stmt->get_result();

  //   $_SESSION['user_cards'] = [];
  //   while ($row = $result->fetch_assoc()) {
  //       $_SESSION['user_cards'][] = $row;
  //   }

  //   if (!empty($_SESSION['user_cards'])) {
  //       $_SESSION['active_card_index'] = 0;
  //   }
  // }

  $user_id = $_SESSION['user_id'];

  require_once 'conn.php';

  $sql = "SELECT * FROM user_payment_data WHERE id = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("i", $user_id);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
      $user_data = $result->fetch_assoc();
  } else {
      error_log("No payment data found for user ID: " . $user_id);
      echo "<script>alert('Error: No payment data found. Please add card before using wallet.');</script>";
  }
  

  $cards = array();
  while ($row = $result->fetch_assoc()) {
      $cards[] = $row;
  }

  $_SESSION['user_cards'] = $cards;
  $_SESSION['active_card_index'] = 0; // Set the first card as active by default
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyCar</title>
    <link rel="stylesheet" href="assets/css/wallet_page.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" rel="stylesheet">
  </head>
<body>
    <nav class="navbar">
      <div class="logo">
          <img id="logo-image" src="assets/css/pic/mycarlogo1.png" alt="MyCar Logo">
      </div>
        <div id="nav-links" class="nav-links">
          <a href="main_page.php" id="home-button"><i class="fas fa-home"></i> Home</a>
          <a href="message_page.php" id="messages-button"><i class="fas fa-comment"></i> Messages</a>
          <a href="activity_activenow_page.php" id="activity-button"><i class="fas fa-bell"></i> Activity</a>
          <a href="#" id="wallet-button"><i class="fas fa-wallet"></i> Wallet</a>
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
        <div class="gradient-section"></div>
        <div class="wallet-container">
            <div class="wallet">
              <div class="wallet-header">
                <h1 class="tittle">Wallet</h1>
                <a class="add-wallet" href="add_card_page.php">+ Add Wallet</a>
              </div>
              <div class="wallet-content">
                <div class="wallet-user-information">
                  <h1>Hi, <?php echo $_SESSION['user_username']; ?>.</h1>
                  <div class="balance-info">
                    <p class="balance-label">Balance</p>
                    <p class="balance">RM <?php echo $cards[0]['user_payment_balance'] ?? '0.00'; ?></p>
                    <p class="main-balance">Main Wallet</p>
                  </div>
                  <div class="wallet-actions">
                    <button class="top-up">Top Up</button>
                    <?php if (count($cards) > 1): ?>
                    <button class="switch-card"><i class="fas fa-sync-alt"></i></button>
                    <?php endif; ?>
                  </div>
                </div>
                <div class="wallet-cards">
                  <div class="wallet-card">
                    <p class="card-balance">RM <?php echo $cards[0]['user_payment_balance'] ?? '0.00'; ?></p>
                    <p class="card-number">**** **** **** <?php echo substr($cards[0]['user_payment_cardnumber'] ?? '', -4); ?></p>
                  </div>
                </div>
              </div>
              <div class="card-details">
                <h3>Card Details</h3>
                <div class="card-details-grid">
                <div class="card-detail-item">
                    <p class="card-detail-label">Card Holder</p>
                    <p class="card-detail-value"><?php echo htmlspecialchars($cards[0]['user_payment_cardname'] ?? 'N/A'); ?></p>
                    </div>
                  <div class="card-detail-item">
                    <p class="card-detail-label">Bank Name</p>
                    <p class="card-detail-value"><?php echo htmlspecialchars($cards[0]['user_payment_bankname'] ?? 'N/A'); ?></p>
                  </div>
                  <div class="card-detail-item">
                    <p class="card-detail-label">Valid Date</p>
                    <p class="card-detail-value"><?php echo htmlspecialchars($cards[0]['user_payment_cardexpdate'] ?? 'N/A'); ?></p>
                  </div>
                  <div class="card-detail-item">
                    <p class="card-detail-label">Card Number</p>
                    <p class="card-detail-value">**** **** **** <?php echo substr($cards[0]['user_payment_cardnumber'] ?? 'N/A', -4); ?></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="transaction">
              <h2>Transaction</h2>
              <div class="transaction-filters">
                <button class="filter-button active">All</button>
                <button class="filter-button">Complete</button>
                <button class="filter-button">Pending</button>
                <button class="filter-button">Rejected</button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="transaction-table-body">
                  <!-- Transaction rows will be populated here -->
                </tbody>
              </table>
              <p class="transaction-message">Transaction function still under development.</p>
              <div class="pagination">
                <select class="per-page-select">
                  <option value="10">10 per page</option>
                  <option value="20">20 per page</option>
                  <option value="50">50 per page</option>
                </select>
                <div class="pagination-info">
                  <span class="current-page">1</span> of <span class="total-pages">1</span> pages
                </div>
                <div class="pagination-controls">
                  <button class="pagination-button prev-page">&lt;</button>
                  <button class="pagination-button next-page">&gt;</button>
                </div>
              </div>
            </div>
          </div>
      </main>

      <!-- Popup container -->
      <div id="popup-container" class="popup-container" style="display: none;">
        <div class="popup-content">
          <h2 id="popup-title"></h2>
          <div id="popup-body"></div>
        </div>
      </div>

    </main>
    <script src="./assets/javascript/wallet_page.js"></script>
    <script src="./assets/javascript/darkmode.js"></script>

</body>
</html>