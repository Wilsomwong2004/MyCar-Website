<?php
header('Content-Type: application/json');


$first_name = $_POST['first_user_name'];
$last_name = $_POST['last_user_name'];
$username = $_POST['username'];
$password = $_POST['password'];
$email = $_POST['email'];
$address = $_POST['address'];
$birthday = $_POST['birthday'];
$gender = $_POST['gender'];

include "conn.php";

$sql = "INSERT INTO user_account_data (user_firstname, user_lastname, user_username, user_password, user_email, user_address, user_birthday, user_gender)
VALUES ('$first_name', '$last_name', '$username', '$password', '$email', '$address', '$birthday', '$gender')";

$result = mysqli_query($conn, $sql);

if ($result) {
    echo json_encode(['status' => 'success', 'message' => 'Account created successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Unable to insert data: ' . mysqli_error($conn)]);
}

mysqli_close($conn);

?>