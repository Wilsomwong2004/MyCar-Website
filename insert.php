<?php

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

// Debug
// echo $sql;

mysqli_query($conn, $sql);

if(mysqli_affected_rows($dbConn) <= 0){
    die("<script>alert('Fail: unable to insert data'); window.history.go(-1);</script>");
}

echo "<script>alert('Successfully insert data!')</script>";

?>