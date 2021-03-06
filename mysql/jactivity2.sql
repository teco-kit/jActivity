-- phpMyAdmin SQL Dump
-- version 4.5.0.2
-- http://www.phpmyadmin.net
--
-- Host: localhost:3306
-- Generation Time: Nov 12, 2015 at 06:09 AM
-- Server version: 5.5.46-0ubuntu0.14.04.2
-- PHP Version: 5.5.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `playground`
--

CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
CREATE USER 'admin'@'%' IDENTIFIED BY 'admin';

GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' IDENTIFIED BY 'admin' WITH GRANT OPTION;

CREATE DATABASE IF NOT EXISTS `jactivity2` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `jactivity2`;

-- --------------------------------------------------------

CREATE TABLE `deviceorientation` (
  `id` varchar(200) NOT NULL,
  `timestamp` varchar(200) NOT NULL,
  `useragent` varchar(200) NOT NULL,
  `label` varchar(200) NOT NULL,
  `beta` varchar(200) NOT NULL,
  `gamma` varchar(200) NOT NULL,
  `alpha` varchar(200) NOT NULL,
  `absolute` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `devicemotion` (
  `id` varchar(200) NOT NULL,
  `timestamp` varchar(200) NOT NULL,
  `useragent` varchar(200) NOT NULL,
  `label` varchar(200) NOT NULL,
  `accelerationX` varchar(200) NOT NULL,
  `accelerationY` varchar(200) NOT NULL,
  `accelerationZ` varchar(200) NOT NULL,
  `accelerationIncludingGravityX` varchar(200) NOT NULL,
  `accelerationIncludingGravityY` varchar(200) NOT NULL,
  `accelerationIncludingGravityZ` varchar(200) NOT NULL,
  `rotationRateBeta` varchar(200) NOT NULL,
  `rotationRateGamma` varchar(200) NOT NULL,
  `rotationRateAlpha` varchar(200) NOT NULL,
  `interval` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Table structure for table `features`
--

CREATE TABLE `features` (
  `feature` varchar(200) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(200) NOT NULL,
  `script` varchar(300) NOT NULL,
  `html` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `labels`
--

CREATE TABLE `labels` (
  `label` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `features`
--
ALTER TABLE `features`
  ADD PRIMARY KEY (`feature`);

--
-- Indexes for table `labels`
--
ALTER TABLE `labels`
  ADD PRIMARY KEY (`label`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
