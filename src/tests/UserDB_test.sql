-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 02, 2020 at 12:21 PM
-- Server version: 5.7.30-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `UserDB_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `Directories`
--

CREATE TABLE `Directories` (
  `id` int(11) NOT NULL,
  `path` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Directories`
--

INSERT INTO `Directories` (`id`, `path`, `createdAt`, `updatedAt`) VALUES
(1, 'root/Coding', '2020-07-02 11:40:43', '2020-07-02 11:40:43'),
(3, 'root/Schule', '2020-07-02 11:40:50', '2020-07-02 11:40:50');

-- --------------------------------------------------------

--
-- Table structure for table `UserDirectories`
--

CREATE TABLE `UserDirectories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `directory_id` int(11) DEFAULT NULL,
  `read` tinyint(1) NOT NULL,
  `write` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `UserDirectories`
--

INSERT INTO `UserDirectories` (`id`, `user_id`, `directory_id`, `read`, `write`, `createdAt`, `updatedAt`) VALUES
(1, 1, 1, 1, 1, '2020-07-02 11:45:57', '2020-07-02 11:45:57'),
(2, 1, 3, 1, 0, '2020-07-02 11:45:57', '2020-07-02 11:45:57');

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Users`
-- password is decrypted 1234
--

INSERT INTO `Users` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'testuser', 'testuser@gmail.com', '$argon2i$v=19$m=4096,t=3,p=1$L3uWGChuS7tVDgbWqaXfgg$twEBmEefmQx+VYDbz+H4jNFABZM00AIV73pGkq+7SlQ', '2020-07-02 11:38:51', '2020-07-02 11:38:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Directories`
--
ALTER TABLE `Directories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `UserDirectories`
--
ALTER TABLE `UserDirectories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `directory_id` (`directory_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Directories`
--
ALTER TABLE `Directories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `UserDirectories`
--
ALTER TABLE `UserDirectories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `UserDirectories`
--
ALTER TABLE `UserDirectories`
  ADD CONSTRAINT `UserDirectories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `UserDirectories_ibfk_2` FOREIGN KEY (`directory_id`) REFERENCES `Directories` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
