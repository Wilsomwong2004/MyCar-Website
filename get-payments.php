<?php
// Enable error reporting and logging
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'php_errors.log');

require_once 'conn.php';

function getUsers() {
    global $conn;
    $users = array();

    $sql = "SELECT * FROM user_payment_data";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $users[] = $row;
        }
        mysqli_free_result($result);
    } else {
        http_response_code(500);
        echo json_encode(["error" => mysqli_error($conn)]);
        exit;
    }

    return $users;
}

$users = getUsers();
header('Content-Type: application/json');
echo json_encode($users);