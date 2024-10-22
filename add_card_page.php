<?php
session_start();
require_once 'conn.php';

// Get the source and user ID from URL parameters
$source = $_GET['source'] ?? 'settings';
$newUserId = $_GET['userId'] ?? null;
$currentUserId = $_SESSION['user_id'] ?? null;

// Function to verify new user
function verifyNewUser($userId, $conn) {
    try {
        // Prepare statement to check if user exists and was recently created
        $sql = "SELECT id, created_at FROM user_data 
                WHERE id = ? 
                AND created_at >= NOW() - INTERVAL 30 MINUTE"; // Only allow users created within last 30 minutes
        
        $stmt = mysqli_prepare($conn, $sql);
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . mysqli_error($conn));
        }
        
        mysqli_stmt_bind_param($stmt, "s", $userId);
        
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception("Failed to execute statement: " . mysqli_stmt_error($stmt));
        }
        
        $result = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_assoc($result);
        
        mysqli_stmt_close($stmt);
        
        return $user !== null;
    } catch (Exception $e) {
        error_log("Error verifying new user: " . $e->getMessage());
        return false;
    }
}

// Function to check if user already has payment methods
function hasExistingPaymentMethods($userId, $conn) {
    try {
        $sql = "SELECT COUNT(*) as count FROM user_payment_data WHERE id = ?";
        $stmt = mysqli_prepare($conn, $sql);
        
        if (!$stmt) {
            throw new Exception("Failed to prepare statement: " . mysqli_error($conn));
        }
        
        mysqli_stmt_bind_param($stmt, "s", $userId);
        
        if (!mysqli_stmt_execute($stmt)) {
            throw new Exception("Failed to execute statement: " . mysqli_stmt_error($stmt));
        }
        
        $result = mysqli_stmt_get_result($stmt);
        $row = mysqli_fetch_assoc($result);
        
        mysqli_stmt_close($stmt);
        
        return $row['count'] > 0;
    } catch (Exception $e) {
        error_log("Error checking payment methods: " . $e->getMessage());
        return false;
    }
}

try {
    // If coming from signup with a new user ID
    if ($source === 'signup' && $newUserId) {
        if (!verifyNewUser($newUserId, $conn)) {
            // Log suspicious activity
            error_log("Suspicious activity: Invalid new user access attempt for ID: " . $newUserId);
            header('Location: index.php');
            exit;
        }
        
        // Store the verified user ID in session
        $_SESSION['temp_user_id'] = $newUserId;
        $activeUserId = $newUserId;
        
    } else if ($source === 'settings') {
        // Ensure user is logged in for settings access
        if (!$currentUserId) {
            header('Location: index.php');
            exit;
        }
        $activeUserId = $currentUserId;
        
    } else {
        // Invalid source
        header('Location: index.php');
        exit;
    }
    
    // Check for existing payment methods
    $hasPaymentMethods = hasExistingPaymentMethods($activeUserId, $conn);
    
    // Store the active user ID and source in session for the form submission
    $_SESSION['active_user_id'] = $activeUserId;
    $_SESSION['payment_setup_source'] = $source;
    
} catch (Exception $e) {
    error_log("Error in add_card_page.php: " . $e->getMessage());
    header('Location: error_page.php');
    exit;
}

// Close the database connection
mysqli_close($conn);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyCar</title>
    <link rel="stylesheet" href="./assets/css/add_card_page.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
    <br/>
</head>

<body>
    <div class="add_card_container">
        <div class="add_card_left">
            <div class="card_info_container">
                <i class="fa-solid fa-wallet fa-beat-fade"></i>
                <p>A digital wallet simplifies the payment process by <br> offering fast, secure, and cashless transactions,<br> enhancing convenience for users.</p>
            </div>
        </div>
    
        <div class="add_card_right">
        <form action="insert_card_details.php" method="post">
            <h2>Add Credit/Debit Card</h2>
            <p>Enter details regarding your Credit/Debit card</p>
                <input
                    type="text"
                    name="payment_user_bank"
                    id="bank_name"
                    placeholder="Bank Name"
                    required
                />
                <input
                    type="number"
                    name="payment_user_number"
                    id="number_on_card"
                    placeholder="Number on Card"
                    maxlength="16"
                    minlength="16"
                    required
                />
                <input
                    type="text"
                    name="payment_user_name"
                    id="name_on_card"
                    placeholder="Name on Card"
                    required
                />
                <input
                    type="text"
                    name="payment_exp_date"
                    id="card_expiration_date"
                    placeholder="Card Expiration Date (MM/YY)"
                    pattern="\d{2}/\d{2}"
                    required
                    title="Please enter a date in MM/YY format"
                />
                <input
                type="number"
                id="card_cvv_number"
                placeholder="CVV"
                maxlength="3"
                required
                />

                <input
                    type="password"
                    name="payment_password"
                    id="password"
                    placeholder="Enter payment password"
                    required
                />

                <div class="agree_w_tnc_container">
                    <input class="agree_w_tnc"
                    type="checkbox"
                    name="agree_w_tnc"
                    value="agree_w_tnc"
                    placeholder="I hereby agree with the Terms & Conditions of MyCar"
                    required
                    />
                    <p>I hereby agree with the <a href="terms_service.php">Terms & Conditions</a> of MyCar</p>
                </div>

                <button id="add_card_btn" type="submit""">Add Card</button>
                <button id="add_card_reset" type="reset" onclick="resetform()">Reset</button>
                <button id="setupLater">I want to set it up later.</button>
            </form>
        </div>
    </div>

    <div id="loadingOverlay" class="overlay hidden">
        <div class="popup-content">
            <div class="loader"></div>
            <p class="loading-text">Adding your card...</p>
        </div>
    </div>

    <div id="confirmPopup" class="popup hidden">
        <div class="popup-content">
            <p class="popup-text">Are you sure you want to set it up later? <br></p>
            <p class="popup-subtext">You can set it up later in setting page.</p>
            <button id="confirmYes">Yes</button>
            <button id="confirmNo">I change my mind</button>
        </div>
    </div>

    <script src="./assets/javascript/add_card_page.js"></script>
    <script src="./assets/javascript/darkmode.js"></script>
    <script src="./assets/javascript/payment_setup_handler.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const form = document.querySelector('form');
            
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const formData = new FormData(this);
                
                // Show loading overlay
                document.getElementById('loadingOverlay').classList.remove('hidden');
                
                fetch('insert_card_details.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    // Hide loading overlay
                    document.getElementById('loadingOverlay').classList.add('hidden');
                    
                    if (data.status === 'success') {
                        alert('Card added successfully!');
                        // Clear setup source from session storage
                        window.paymentSetupHandler.clearSource();
                        // Always redirect to index.php after card setup from signup
                        window.location.href = 'index.php';
                    } else {
                        alert('Error: ' + data.message);
                    }
                })
                .catch(error => {
                    // Hide loading overlay
                    document.getElementById('loadingOverlay').classList.add('hidden');
                    console.error('Error:', error);
                    alert('An error occurred while adding the card.');
                });
            });
        });

    </script>
</body>
</html>

