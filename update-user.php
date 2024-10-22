<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

require_once 'conn.php';

// Log all received POST data
error_log("Received POST data: " . print_r($_POST, true));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debug: Log all received data
    error_log("Processing user update request. POST data: " . print_r($_POST, true));
    
    // Get user_id (change from 'id' to 'user_id' to match your form)
    $user_id = $_POST['user_id'] ?? null;
    
    if (!$user_id) {
        error_log("No user_id provided in request");
        echo json_encode([
            "success" => false,
            "error" => "No user ID provided"
        ]);
        exit;
    }

    // Get all form fields with null coalescing operator for safety
    $firstname = $_POST['user_firstname'] ?? '';
    $lastname = $_POST['user_lastname'] ?? '';
    $username = $_POST['user_phone'] ?? ''; // matches your form field name
    $email = $_POST['user_email'] ?? '';
    $address = $_POST['user_address'] ?? '';
    $birthday = $_POST['user_birthday'] ?? '';
    $gender = $_POST['user_gender'] ?? '';
    
    // Debug: Log processed data
    error_log("Processed data: " . print_r([
        'user_id' => $user_id,
        'firstname' => $firstname,
        'lastname' => $lastname,
        'username' => $username,
        'email' => $email,
        'address' => $address,
        'birthday' => $birthday,
        'gender' => $gender
    ], true));

    // Start building the SQL query
    $sql = "UPDATE user_account_data SET 
            user_firstname = ?,
            user_lastname = ?,
            user_username = ?,
            user_email = ?,
            user_address = ?,
            user_birthday = ?,
            user_gender = ?";
    
    $params = [$firstname, $lastname, $username, $email, $address, $birthday, $gender];
    $types = "sssssss"; // string types for all parameters
    
    // Add password update if provided
    if (!empty($_POST['user_password'])) {
        $password = $_POST['user_password'];
        $sql .= ", user_password = ?";
        $params[] = $password;
        $types .= "s";
    }
    
    // Add WHERE clause
    $sql .= " WHERE id = ?";
    $params[] = $user_id;
    $types .= "i"; // integer for user_id
    
    // Debug: Log the SQL query (with placeholders)
    error_log("SQL Query: " . $sql);
    
    // Prepare and execute the statement
    $stmt = mysqli_prepare($conn, $sql);
    if ($stmt) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
        
        if (mysqli_stmt_execute($stmt)) {
            error_log("Update successful for user_id: " . $user_id);
            echo json_encode([
                "success" => true,
                "message" => "User updated successfully"
            ]);
        } else {
            $error = mysqli_error($conn);
            error_log("Database error: " . $error);
            echo json_encode([
                "success" => false,
                "error" => "Database error: " . $error
            ]);
        }
        mysqli_stmt_close($stmt);
    } else {
        $error = mysqli_error($conn);
        error_log("Failed to prepare statement: " . $error);
        echo json_encode([
            "success" => false,
            "error" => "Failed to prepare statement: " . $error
        ]);
    }
} else {
    error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
    echo json_encode([
        "success" => false,
        "error" => "Invalid request method"
    ]);
}