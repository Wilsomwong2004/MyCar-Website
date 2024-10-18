<?php
$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'userdata';

$conn = mysqli_connect($servername, $username, $password, $dbname);

if (!$conn) {
    throw new Exception("Failed to connect to MySQL: " . mysqli_connect_error());
}

// Optionally, you can set the connection to use UTF-8
mysqli_set_charset($conn, 'utf8mb4');
?>