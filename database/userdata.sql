-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2024 at 05:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `userdata`
--

-- --------------------------------------------------------

--
-- Table structure for table `user_account_data`
--

CREATE TABLE `user_account_data` (
  `id` int(255) NOT NULL,
  `user_firstname` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_lastname` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_username` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_address` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_birthday` date NOT NULL,
  `user_gender` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_verification_code` int(255) NOT NULL,
  `user_profile_pic` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_account_data`
--

INSERT INTO `user_account_data` (`id`, `user_firstname`, `user_lastname`, `user_username`, `user_password`, `user_email`, `user_address`, `user_birthday`, `user_gender`, `user_verification_code`, `user_profile_pic`) VALUES
(24, 'Joanna', 'Chan', 'Joanna', '1234', 'Joanna@gmail.com', 'No.123, tmn bukit bintang', '1999-11-23', 'female', 656810, './assets/css/pic/profile_pics/6717a153283a5_profile.jpg'),
(27, 'Gugu', 'Gaga', 'gugugaga', 'gugugaga123', 'gugugaga@gmail.com', 'qwerty', '2004-04-04', 'male', 704211, './assets/css/pic/Unknown_acc-removebg.png'),
(28, 'Ala', 'Kazam', 'alakazam', 'alakazam123456', 'alakazam123456@gmail.com', 'asdfghjkl', '2005-12-20', 'Male', 0, './assets/css/pic/Unknown_acc-removebg.png'),
(29, 'Oliver', 'Twist', 'olivertwist', 'oliver123456', 'olivertwist@gmail.com', 'qwertyuiop', '2006-04-04', 'Male', 0, './assets/css/pic/Unknown_acc-removebg.png'),
(30, 'Bruce ', 'Wayne', 'brucewayne', 'bruce123456', 'iambatman@gmail.com', 'Wayne Manor', '1940-06-30', 'male', 0, './assets/css/pic/Unknown_acc-removebg.png');

-- --------------------------------------------------------

--
-- Table structure for table `user_payment_data`
--

CREATE TABLE `user_payment_data` (
  `payment_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `user_payment_bankname` text NOT NULL,
  `user_payment_cardnumber` bigint(255) NOT NULL,
  `user_payment_cardname` text NOT NULL,
  `user_payment_cardexpdate` text NOT NULL,
  `user_payment_cvv` int(10) NOT NULL,
  `user_payment_password` int(255) NOT NULL,
  `user_payment_balance` bigint(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_payment_data`
--

INSERT INTO `user_payment_data` (`payment_id`, `id`, `user_payment_bankname`, `user_payment_cardnumber`, `user_payment_cardname`, `user_payment_cardexpdate`, `user_payment_cvv`, `user_payment_password`, `user_payment_balance`) VALUES
(33, 27, 'Maybank', 1234567890123456, 'Gugu Gaga', '12/25', 123, 0, 500),
(34, 27, 'CIMB', 987654321654321, 'Gugu Gaga Gigi', '11/21', 321, 0, 2020),
(35, 28, 'Public Bank', 1111222233334444, 'Alakazam', '02/28', 999, 0, 6666),
(36, 29, 'Maybank', 1234123412341234, 'Oliver Twist', '04/28', 0, 0, 1),
(37, 30, 'Public Bank', 9999888877776666, 'Bruce Wayne', '12/25', 999, 0, 189665452),
(38, 30, 'Public Bank', 9898989898989898, 'Brucey Boy', '08/26', 969, 0, 1000000),
(39, 30, 'Public Bank', 1234512345123451, 'MasterBruce', '08/30', 666, 0, 894586752);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_account_data`
--
ALTER TABLE `user_account_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_payment_data`
--
ALTER TABLE `user_payment_data`
  ADD PRIMARY KEY (`payment_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user_account_data`
--
ALTER TABLE `user_account_data`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user_payment_data`
--
ALTER TABLE `user_payment_data`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
