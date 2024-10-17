<?php
$servername = 'localhost';
$user = 'root';
$password = '';
$dbname = 'userdata';

$dbConn = mysqli_connect($servername, $user, $password, $dbname);

if (mysqli_connect_errno()) {
    die('<script>alert("Failed to connect to MySQL: Please check your SQL connection!");</script>');
}

echo "<script>alert('Connected successfully');</script>";

?>