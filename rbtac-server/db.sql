-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Jul 15, 2025 at 06:01 PM
-- Server version: 8.0.42
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `docker`
--

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int NOT NULL,
  `website_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `columns` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `metadata` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `website_id`, `name`, `columns`, `created_at`, `updated_at`, `metadata`) VALUES
(1, 1, 'Company', '[{\"id\": \"col_hogkjb9ms\", \"name\": \"Name\", \"type\": \"text\", \"isArray\": false, \"required\": true}, {\"id\": \"1751862448933\", \"name\": \"Turn Over\", \"type\": \"number\", \"isArray\": false, \"showMenu\": false, \"defaultValue\": \"3000000\"}, {\"id\": \"1751858242296\", \"name\": \"Reg\", \"type\": \"text\", \"isArray\": false}, {\"id\": \"1751863730036\", \"name\": \"Status\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#fe0b0b\", \"label\": \"Declined\", \"value\": \"declined\", \"background\": \"#ffb8b8\"}, {\"color\": \"#008a5c\", \"label\": \"Approved\", \"value\": \"approved_\", \"background\": \"#b3ffe8\"}, {\"color\": \"#ffffff\", \"label\": \"Interview\", \"value\": \"Interview\", \"background\": \"#8433dd\"}, {\"color\": \"#ffffff\", \"label\": \"In progress\", \"value\": \"In progress\", \"background\": \"#000040\"}, {\"color\": \"#ffffff\", \"label\": \"Waiting for docs\", \"value\": \"Waiting for docs\", \"background\": \"#ff0006\"}], \"required\": false, \"showMenu\": false}, {\"id\": \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\", \"name\": \"Progress\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#000000\", \"label\": \"Active\", \"value\": \"active\", \"isDefault\": false, \"background\": \"#ffbe8f\"}, {\"color\": \"#594f4f\", \"label\": \"Done\", \"value\": \"done\", \"isDefault\": false, \"background\": \"#baf7b5\"}, {\"color\": \"#ff0000\", \"label\": \"To do\", \"value\": \"To do\", \"isDefault\": true, \"background\": \"#fec3c3\"}], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_6f8788fa-7ac9-40c3-aaf1-eb19c537e67e\", \"name\": \"Reviewed \", \"type\": \"boolean\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"1751861044577\", \"name\": \"Created At\", \"type\": \"date\", \"isArray\": false, \"showMenu\": false, \"defaultValue\": \"2025-07-24\"}, {\"id\": \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\", \"name\": \"Reason Codes\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#c48517\", \"label\": \"Missing Docs\", \"value\": \"Missing Docs\", \"background\": \"#ffeadb\"}, {\"color\": \"#0a8f0c\", \"label\": \"Profitable \", \"value\": \"Profitable \", \"background\": \"#93fe8b\"}, {\"color\": \"#c80404\", \"label\": \"Risky\", \"value\": \"Risky\", \"background\": \"#ffcccc\"}, {\"color\": \"#ffffff\", \"label\": \"Out of Area\", \"value\": \"Out of Area\", \"background\": \"#000000\"}], \"required\": false, \"showMenu\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_1677b75c-6e17-4ba4-90cf-00524c5ee184\", \"name\": \"UIF Number\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}]', '2025-07-07 02:52:28', '2025-07-12 14:55:45', NULL),
(2, 1, 'Order', '[{\"id\": \"1\", \"name\": \"Name\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"isPrimary\": true}, {\"id\": \"col_fa27a524-2583-4b28-a74a-3febd10c952c\", \"name\": \"Customer\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"isPrimary\": false}, {\"id\": \"col_4dc765f1-20dc-4f15-b761-bfcf90057dd0\", \"name\": \"Number\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"isPrimary\": false}]', '2025-07-09 19:29:31', '2025-07-11 06:33:41', NULL),
(3, 1, 'Product', '[{\"id\": \"col_16af25be-9449-4187-8842-6767486e4a0e\", \"name\": \"Name\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"isPrimary\": true}, {\"id\": \"col_d39b7eaa-67f3-4ef4-926d-91927d251f5c\", \"name\": \"Price\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_d64c9ca4-8469-483d-add7-bfc03bf72227\", \"name\": \"Old Price\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}]', '2025-07-10 08:43:15', '2025-07-11 06:33:46', NULL),
(4, 1, 'Task', '[{\"id\": \"col_dc1074fa-aab1-4a02-86ef-ee978eaf869f\", \"name\": \"Name\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"isPrimary\": true}, {\"id\": \"col_115842d3-9fa5-485a-ac37-c05a038e021e\", \"name\": \"Company\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"showMenu\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_51adf5c0-954a-4454-93f6-4ea8a9ec4509\", \"name\": \"Track\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#ffffff\", \"label\": \"New\", \"value\": \"new\", \"isDefault\": true, \"background\": \"#8e8f90\"}, {\"color\": \"#000000\", \"label\": \"Progress\", \"value\": \"progress\", \"isDefault\": false, \"background\": \"#f5e266\"}, {\"color\": \"#ffffff\", \"label\": \"Done\", \"value\": \"done\", \"isDefault\": false, \"background\": \"#14db22\"}], \"required\": false, \"showMenu\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 2}, {\"id\": \"col_977ce958-0532-4e10-9a20-010e498cdb28\", \"name\": \"Comments \", \"type\": \"textarea\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_67c60838-a5a7-41c2-a9a7-b689db15599f\", \"name\": \"Due date\", \"type\": \"date\", \"isArray\": false, \"options\": [], \"required\": false, \"showMenu\": false, \"isPrimary\": false, \"defaultValue\": \"2025-08-30\", \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}]', '2025-07-10 08:43:59', '2025-07-12 15:05:26', NULL),
(5, 1, 'Budget', '[{\"id\": \"col_2b164e80-07cb-4366-9fc5-3a2fcadd4722\", \"name\": \"Name\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"isPrimary\": true}, {\"id\": \"col_c5451b88-8fc5-402b-8633-b820aa357aa7\", \"name\": \"Category\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#ffffff\", \"label\": \"Expense\", \"value\": \"expense\", \"background\": \"#f97316\"}, {\"color\": \"#ffffff\", \"label\": \"Piolicy\", \"value\": \"piolicy\", \"background\": \"#f97316\"}, {\"color\": \"#ffffff\", \"label\": \"Investment \", \"value\": \"investment_\", \"background\": \"#f97316\"}, {\"color\": \"#ffffff\", \"label\": \"Dump Sheet\", \"value\": \"dump_sheet\", \"background\": \"#ff0000\"}], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_94d5b447-aaab-45ea-bdec-64225d0844e0\", \"name\": \"Amount\", \"type\": \"number\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_ab934677-87a9-4977-bdbe-33ab6758aaa3\", \"name\": \"Adjusted Amount\", \"type\": \"number\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_0b80f0ab-9932-48a1-9cb7-79ac9ff7ccb4\", \"name\": \"Payment Type\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#ffffff\", \"label\": \"EFT\", \"value\": \"eft\", \"background\": \"#f97316\"}, {\"color\": \"#ffffff\", \"label\": \"Cash\", \"value\": \"cash\", \"background\": \"#3a322c\"}, {\"color\": \"#ffffff\", \"label\": \"Debit Order\", \"value\": \"debit_order\", \"background\": \"#f91583\"}], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_52c4e169-7904-495f-9ec7-a8beefbb0c60\", \"name\": \"Status\", \"type\": \"boolean\", \"isArray\": false, \"options\": [{\"color\": \"#ffffff\", \"label\": \"\", \"value\": \"\", \"background\": \"#f97316\"}], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}]', '2025-07-10 08:53:49', '2025-07-10 08:57:22', NULL),
(6, 1, 'Aproved Suppliers', '[{\"id\": \"col_6c232819-6553-4046-9024-ae3c18aa4a08\", \"name\": \"Name\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"isPrimary\": true}, {\"id\": \"col_0c65ebe8-6dee-4453-a2ca-951f17274941\", \"name\": \"Tax Pin\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_72ff3b8c-fce6-46c4-821d-cfc65911c7a6\", \"name\": \"BEE Certicate Valid\", \"type\": \"boolean\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_87330fdc-ae9f-4a82-ba26-d242fbb81e33\", \"name\": \"Sector\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#000040\", \"label\": \"IT\", \"value\": \"IT\", \"isDefault\": false, \"background\": \"#00ffff\"}, {\"color\": \"#ffffff\", \"label\": \"Agricultor\", \"value\": \"Agricultor\", \"isDefault\": true, \"background\": \"#f97316\"}, {\"color\": \"#ffffff\", \"label\": \"Reatial\", \"value\": \"Reatial\", \"isDefault\": false, \"background\": \"#800040\"}], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_b2551437-493d-4840-b21d-349a53f519e8\", \"name\": \"Status\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#000000\", \"label\": \"Active\", \"value\": \"Active\", \"background\": \"#00ff80\"}, {\"color\": \"#ffffff\", \"label\": \"Non complient\", \"value\": \"Non complient\", \"background\": \"#ff0000\"}], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}]', '2025-07-11 11:13:55', '2025-07-12 03:32:29', NULL),
(7, 1, 'Sectors', '[{\"id\": \"col_ada1ca84-a53f-4c5f-9d8b-b9fa98f62cee\", \"name\": \"Name\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"isPrimary\": true}, {\"id\": \"col_150fc37d-54c2-4eff-956a-838d2d20ec22\", \"name\": \"Sub Sector\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"showMenu\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_7a354c20-b242-42ea-a7b7-296318c111ad\", \"name\": \"Sub Sub  Sector\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"showMenu\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}]', '2025-07-11 11:25:31', '2025-07-12 14:24:23', NULL),
(8, 1, 'Action Plan', '[{\"id\": \"col_20650cd3-9409-4ebb-87ab-4c642f7de9f9\", \"name\": \"Task\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"showMenu\": false, \"isPrimary\": true}, {\"id\": \"col_7b17969e-f9fa-4ee0-9588-7e5f9fe6e6be\", \"name\": \"Due Date\", \"type\": \"date\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_c164df56-3f50-40ed-9af2-bd261ffc053e\", \"name\": \"How\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}]', '2025-07-12 14:28:18', '2025-07-12 14:28:52', NULL),
(9, 1, 'Bank Statements', '[{\"id\": \"col_39b959d7-f3f3-4b14-a2a1-99b9304f7d9e\", \"name\": \"Month\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#ffffff\", \"label\": \"Jan\", \"value\": \"Jan\", \"background\": \"#f97316\"}, {\"color\": \"#ffffff\", \"label\": \"Feb\", \"value\": \"Feb\", \"background\": \"#f97316\"}, {\"color\": \"#ffffff\", \"label\": \"March\", \"value\": \"March\", \"background\": \"#f97316\"}, {\"color\": \"#ffffff\", \"label\": \"Apr\", \"value\": \"Apr\", \"background\": \"#f97316\"}], \"required\": false, \"showMenu\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_d68c2f36-dc9a-491b-abb2-61ab47879fca\", \"name\": \"Monthly Expense\", \"type\": \"number\", \"isArray\": false, \"required\": false, \"showMenu\": false, \"isPrimary\": true}, {\"id\": \"col_fd81800a-969e-4f3e-913f-9400e66c1ce8\", \"name\": \"Open Balance\", \"type\": \"number\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_b95f627a-66e6-44a4-b769-949dfeb97533\", \"name\": \"Closing Balance\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_12a1c237-3f00-45d5-9541-0858a88feda2\", \"name\": \"Company\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_17b7d5d0-6ae9-46c1-a2c0-86e14b999500\", \"name\": \"Profit\", \"type\": \"number\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}]', '2025-07-12 14:49:32', '2025-07-12 14:54:26', NULL),
(10, 1, 'Feedback', '[{\"id\": \"col_575c6dbd-968e-4926-acec-9c9e62294d3c\", \"name\": \"Name\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"isPrimary\": true}]', '2025-07-12 14:59:09', '2025-07-12 14:59:09', NULL),
(11, 1, 'Memberships', '[{\"id\": \"col_e23da3f6-a960-47e5-9998-968ba34ecc6d\", \"name\": \"Customer name\", \"type\": \"text\", \"isArray\": false, \"required\": false, \"showMenu\": false, \"isPrimary\": true}, {\"id\": \"col_2bcf803c-ee7d-49c5-89df-4dd78955350f\", \"name\": \"Phone\", \"type\": \"text\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_514b578e-9cc6-4f67-8901-b770308000d9\", \"name\": \"Pacakage\", \"type\": \"select\", \"isArray\": false, \"options\": [{\"color\": \"#ffffff\", \"label\": \"Silver\", \"value\": \"Silver\", \"background\": \"#f97316\"}, {\"color\": \"#ffffff\", \"label\": \"Gold\", \"value\": \"Gold\", \"background\": \"#f349d4\"}, {\"color\": \"#ffffff\", \"label\": \"Planum\", \"value\": \"Planum\", \"background\": \"#b49a88\"}], \"required\": false, \"showMenu\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}, {\"id\": \"col_31e66b7c-dacf-4061-a628-35f9054dc0aa\", \"name\": \"Prince\", \"type\": \"number\", \"isArray\": false, \"options\": [], \"required\": false, \"isPrimary\": false, \"relationship\": {\"direction\": \"one-to-one\", \"createReverse\": false, \"reverseFieldName\": \"\"}, \"referenceCollectionId\": 0}]', '2025-07-12 16:01:18', '2025-07-12 16:03:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `collection_data`
--

CREATE TABLE `collection_data` (
  `id` int NOT NULL,
  `collection_id` int NOT NULL,
  `data` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `collection_data`
--

INSERT INTO `collection_data` (`id`, `collection_id`, `data`, `created_at`, `updated_at`) VALUES
(2, 1, '{\"1751858242296\": \"TB20993\", \"1751861044577\": \"2025-08-09\", \"1751862448933\": 1000, \"1751863730036\": \"declined\", \"col_hogkjb9ms\": \"Spar Woodmead\", \"col_1677b75c-6e17-4ba4-90cf-00524c5ee184\": \"UIF 3232\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Out of Area\", \"col_6f8788fa-7ac9-40c3-aaf1-eb19c537e67e\": true, \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"active\"}', '2025-07-07 03:00:47', '2025-07-12 14:55:51'),
(3, 1, '{\"1751858242296\": \"TBX 112 588\", \"1751861044577\": \"2025-08-02\", \"1751862448933\": 2000, \"1751863730036\": \"Waiting for docs\", \"col_hogkjb9ms\": \"Tybo Solutions\", \"col_1677b75c-6e17-4ba4-90cf-00524c5ee184\": \"UIF 3232\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Missing Docs\", \"col_6f8788fa-7ac9-40c3-aaf1-eb19c537e67e\": true, \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"active\"}', '2025-07-07 03:18:04', '2025-07-12 14:55:52'),
(4, 1, '{\"1751858242296\": \"Bx-8987-8989\", \"1751861044577\": \"2025-08-04\", \"1751862448933\": 3000, \"1751863730036\": \"Waiting for docs\", \"col_hogkjb9ms\": \"Boxer Super Store\", \"col_1677b75c-6e17-4ba4-90cf-00524c5ee184\": \"UIF 3232\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Missing Docs\", \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"done\"}', '2025-07-07 04:03:19', '2025-07-12 14:55:52'),
(5, 1, '{\"1751858242296\": \"6766-0998-99\", \"1751861044577\": \"2025-07-09\", \"1751862448933\": 82220, \"1751863730036\": \"Waiting for docs\", \"col_hogkjb9ms\": \"BBD Tech\", \"col_1677b75c-6e17-4ba4-90cf-00524c5ee184\": \"UIF 3232\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Missing Docs\", \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"To do\"}', '2025-07-09 02:48:15', '2025-07-12 14:55:53'),
(6, 1, '{\"1751858242296\": \"TBX 112 588\", \"1751861044577\": \"2025-08-02\", \"1751862448933\": 5000, \"1751863730036\": \"approved_\", \"col_hogkjb9ms\": \"Tybo Solutions\", \"col_1677b75c-6e17-4ba4-90cf-00524c5ee184\": \"UIF 3232\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Profitable \", \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"To do\"}', '2025-07-09 03:15:00', '2025-07-12 14:55:54'),
(7, 1, '{\"1751858242296\": \"TB20993\", \"1751861044577\": \"2025-08-09\", \"1751862448933\": 5220, \"1751863730036\": \"Interview\", \"col_hogkjb9ms\": \"Spar\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Missing Docs\", \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"done\"}', '2025-07-09 03:15:00', '2025-07-12 14:45:48'),
(8, 1, '{\"1751858242296\": \"DD 8578 7878\", \"1751861044577\": \"2025-07-18\", \"1751862448933\": 2000, \"1751863730036\": \"Interview\", \"col_hogkjb9ms\": \"Dimension Data Brinston\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Missing Docs\", \"col_6f8788fa-7ac9-40c3-aaf1-eb19c537e67e\": true, \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"done\"}', '2025-07-10 07:54:33', '2025-07-12 14:45:49'),
(9, 1, '{\"1751858242296\": \"588787878\", \"1751861044577\": \"2025-07-24\", \"1751862448933\": 3000, \"1751863730036\": \"declined\", \"col_hogkjb9ms\": \"Edgars\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Risky\", \"col_6f8788fa-7ac9-40c3-aaf1-eb19c537e67e\": true, \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"active\"}', '2025-07-10 07:55:17', '2025-07-12 04:50:46'),
(10, 3, '{}', '2025-07-10 08:44:05', '2025-07-10 08:44:05'),
(11, 4, '{\"col_115842d3-9fa5-485a-ac37-c05a038e021e\": \"Tybo Solution\", \"col_51adf5c0-954a-4454-93f6-4ea8a9ec4509\": \"new\", \"col_977ce958-0532-4e10-9a20-010e498cdb28\": \"Still No pitch\", \"col_dc1074fa-aab1-4a02-86ef-ee978eaf869f\": \"Create Login Screen\"}', '2025-07-10 08:44:48', '2025-07-12 15:04:17'),
(12, 4, '{\"col_51adf5c0-954a-4454-93f6-4ea8a9ec4509\": \"progress\", \"col_dc1074fa-aab1-4a02-86ef-ee978eaf869f\": \"Create backend\"}', '2025-07-10 08:44:48', '2025-07-10 17:46:08'),
(13, 4, '{\"col_51adf5c0-954a-4454-93f6-4ea8a9ec4509\": \"done\", \"col_dc1074fa-aab1-4a02-86ef-ee978eaf869f\": \"Create admin dashboard\"}', '2025-07-10 08:47:24', '2025-07-12 15:04:17'),
(14, 5, '{\"col_0b80f0ab-9932-48a1-9cb7-79ac9ff7ccb4\": \"eft\", \"col_2b164e80-07cb-4366-9fc5-3a2fcadd4722\": \"Eletricity\", \"col_52c4e169-7904-495f-9ec7-a8beefbb0c60\": true, \"col_94d5b447-aaab-45ea-bdec-64225d0844e0\": 2000, \"col_ab934677-87a9-4977-bdbe-33ab6758aaa3\": 2000, \"col_c5451b88-8fc5-402b-8633-b820aa357aa7\": \"expense\"}', '2025-07-10 08:54:16', '2025-07-10 09:01:09'),
(15, 5, '{\"col_0b80f0ab-9932-48a1-9cb7-79ac9ff7ccb4\": \"eft\", \"col_2b164e80-07cb-4366-9fc5-3a2fcadd4722\": \"School Fees\", \"col_52c4e169-7904-495f-9ec7-a8beefbb0c60\": true, \"col_94d5b447-aaab-45ea-bdec-64225d0844e0\": 5000, \"col_ab934677-87a9-4977-bdbe-33ab6758aaa3\": 4500, \"col_c5451b88-8fc5-402b-8633-b820aa357aa7\": \"expense\"}', '2025-07-10 08:58:36', '2025-07-10 09:01:12'),
(16, 5, '{\"col_0b80f0ab-9932-48a1-9cb7-79ac9ff7ccb4\": \"cash\", \"col_2b164e80-07cb-4366-9fc5-3a2fcadd4722\": \"Ndu\'s Loan\", \"col_94d5b447-aaab-45ea-bdec-64225d0844e0\": 500, \"col_ab934677-87a9-4977-bdbe-33ab6758aaa3\": 500, \"col_c5451b88-8fc5-402b-8633-b820aa357aa7\": \"dump_sheet\"}', '2025-07-10 08:59:30', '2025-07-10 08:59:59'),
(19, 1, '{\"1751858242296\": \"TB20995\", \"1751861044577\": \"2025-07-24\", \"1751862448933\": \"3000000\", \"1751863730036\": \"declined\", \"col_hogkjb9ms\": \"Ocean Basket\", \"col_481c5ffc-506d-4724-b317-ccefe38b0738\": \"\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Missing Docs\", \"col_6f8788fa-7ac9-40c3-aaf1-eb19c537e67e\": \"\", \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"active\"}', '2025-07-11 08:33:01', '2025-07-12 14:02:48'),
(20, 1, '{\"1751858242296\": \"TB209977\", \"1751861044577\": \"2025-07-24\", \"1751862448933\": \"3000000\", \"1751863730036\": \"In progress\", \"col_hogkjb9ms\": \"DHD\", \"col_481c5ffc-506d-4724-b317-ccefe38b0738\": \"\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Risky\", \"col_6f8788fa-7ac9-40c3-aaf1-eb19c537e67e\": \"\", \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"active\"}', '2025-07-11 08:33:08', '2025-07-12 14:02:54'),
(21, 1, '{\"1751858242296\": \"TB20998\", \"1751861044577\": \"2025-07-24\", \"1751862448933\": 3000001, \"1751863730036\": \"In progress\", \"col_hogkjb9ms\": \"Snack Bar\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\": \"Missing Docs\", \"col_6f8788fa-7ac9-40c3-aaf1-eb19c537e67e\": true, \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\": \"active\"}', '2025-07-11 08:33:08', '2025-07-12 14:45:51'),
(24, 3, '{\"col_16af25be-9449-4187-8842-6767486e4a0e\": \"\", \"col_d39b7eaa-67f3-4ef4-926d-91927d251f5c\": \"\", \"col_d64c9ca4-8469-483d-add7-bfc03bf72227\": \"\"}', '2025-07-11 09:24:05', '2025-07-11 09:24:05'),
(37, 6, '{\"col_0c65ebe8-6dee-4453-a2ca-951f17274941\": \"200 25888/847\", \"col_6c232819-6553-4046-9024-ae3c18aa4a08\": \"Makro\", \"col_72ff3b8c-fce6-46c4-821d-cfc65911c7a6\": true, \"col_87330fdc-ae9f-4a82-ba26-d242fbb81e33\": \"Reatial\", \"col_b2551437-493d-4840-b21d-349a53f519e8\": \"Active\"}', '2025-07-11 11:18:49', '2025-07-12 03:32:13'),
(39, 6, '{\"col_0c65ebe8-6dee-4453-a2ca-951f17274941\": \"200 8787/847\", \"col_6c232819-6553-4046-9024-ae3c18aa4a08\": \"Game shops\", \"col_72ff3b8c-fce6-46c4-821d-cfc65911c7a6\": true, \"col_87330fdc-ae9f-4a82-ba26-d242fbb81e33\": \"Agricultor\", \"col_b2551437-493d-4840-b21d-349a53f519e8\": \"Active\"}', '2025-07-11 11:18:55', '2025-07-12 03:32:11'),
(42, 6, '{\"col_0c65ebe8-6dee-4453-a2ca-951f17274941\": \"200 7887/847\", \"col_6c232819-6553-4046-9024-ae3c18aa4a08\": \"Dk supplies\", \"col_72ff3b8c-fce6-46c4-821d-cfc65911c7a6\": true, \"col_87330fdc-ae9f-4a82-ba26-d242fbb81e33\": \"Agricultor\", \"col_b2551437-493d-4840-b21d-349a53f519e8\": \"Non complient\"}', '2025-07-11 11:20:38', '2025-07-12 03:31:56'),
(43, 2, '{\"1\": \"\", \"col_4dc765f1-20dc-4f15-b761-bfcf90057dd0\": \"\", \"col_fa27a524-2583-4b28-a74a-3febd10c952c\": \"\"}', '2025-07-11 11:23:33', '2025-07-11 11:23:33'),
(44, 2, '{\"1\": \"\", \"col_4dc765f1-20dc-4f15-b761-bfcf90057dd0\": \"\", \"col_fa27a524-2583-4b28-a74a-3febd10c952c\": \"\"}', '2025-07-11 11:23:34', '2025-07-11 11:23:34'),
(45, 2, '{\"1\": \"\", \"col_4dc765f1-20dc-4f15-b761-bfcf90057dd0\": \"\", \"col_fa27a524-2583-4b28-a74a-3febd10c952c\": \"\"}', '2025-07-11 11:23:35', '2025-07-11 11:23:35'),
(52, 7, '{\"col_150fc37d-54c2-4eff-956a-838d2d20ec22\": \"Comp\", \"col_ada1ca84-a53f-4c5f-9d8b-b9fa98f62cee\": \"IT\"}', '2025-07-12 03:38:17', '2025-07-12 14:25:59'),
(53, 7, '{\"col_ada1ca84-a53f-4c5f-9d8b-b9fa98f62cee\": \"Retail\"}', '2025-07-12 03:38:17', '2025-07-12 03:39:20'),
(54, 7, '{\"col_ada1ca84-a53f-4c5f-9d8b-b9fa98f62cee\": \"Finance\"}', '2025-07-12 03:38:18', '2025-07-12 03:39:35'),
(55, 7, '{\"col_ada1ca84-a53f-4c5f-9d8b-b9fa98f62cee\": \"\"}', '2025-07-12 03:41:11', '2025-07-12 03:41:11'),
(56, 7, '{\"col_ada1ca84-a53f-4c5f-9d8b-b9fa98f62cee\": \"\"}', '2025-07-12 03:41:12', '2025-07-12 03:41:12'),
(57, 7, '{\"col_ada1ca84-a53f-4c5f-9d8b-b9fa98f62cee\": \"\"}', '2025-07-12 03:41:13', '2025-07-12 03:41:13'),
(58, 4, '{\"col_115842d3-9fa5-485a-ac37-c05a038e021e\": \"Tybo Solution\", \"col_51adf5c0-954a-4454-93f6-4ea8a9ec4509\": \"progress\", \"col_67c60838-a5a7-41c2-a9a7-b689db15599f\": \"2025-08-25\", \"col_bf8f12ee-0fc7-46fb-a487-740cfdf62391\": \"\", \"col_dc1074fa-aab1-4a02-86ef-ee978eaf869f\": \"Create a cashflow \"}', '2025-07-12 14:46:55', '2025-07-12 14:48:44'),
(59, 9, '{\"col_12a1c237-3f00-45d5-9541-0858a88feda2\": \"Tybo Solution\", \"col_17b7d5d0-6ae9-46c1-a2c0-86e14b999500\": 4000, \"col_39b959d7-f3f3-4b14-a2a1-99b9304f7d9e\": \"Jan\", \"col_b95f627a-66e6-44a4-b769-949dfeb97533\": \"5000\", \"col_d68c2f36-dc9a-491b-abb2-61ab47879fca\": 10000, \"col_fd81800a-969e-4f3e-913f-9400e66c1ce8\": 25000}', '2025-07-12 14:52:32', '2025-07-12 14:54:31'),
(60, 9, '{\"col_12a1c237-3f00-45d5-9541-0858a88feda2\": \"Tybo Solution\", \"col_17b7d5d0-6ae9-46c1-a2c0-86e14b999500\": 6000, \"col_39b959d7-f3f3-4b14-a2a1-99b9304f7d9e\": \"Feb\", \"col_b95f627a-66e6-44a4-b769-949dfeb97533\": \"1000\", \"col_d68c2f36-dc9a-491b-abb2-61ab47879fca\": 20000, \"col_fd81800a-969e-4f3e-913f-9400e66c1ce8\": 35000}', '2025-07-12 14:54:04', '2025-07-12 14:54:41'),
(61, 9, '{\"col_12a1c237-3f00-45d5-9541-0858a88feda2\": \"\", \"col_39b959d7-f3f3-4b14-a2a1-99b9304f7d9e\": \"Apr\", \"col_b95f627a-66e6-44a4-b769-949dfeb97533\": \"\", \"col_d68c2f36-dc9a-491b-abb2-61ab47879fca\": null, \"col_fd81800a-969e-4f3e-913f-9400e66c1ce8\": \"\"}', '2025-07-12 14:54:04', '2025-07-12 15:07:39'),
(62, 4, '{\"col_115842d3-9fa5-485a-ac37-c05a038e021e\": \"Spar\", \"col_51adf5c0-954a-4454-93f6-4ea8a9ec4509\": \"new\", \"col_67c60838-a5a7-41c2-a9a7-b689db15599f\": \"2025-08-09\", \"col_977ce958-0532-4e10-9a20-010e498cdb28\": \"\", \"col_bf8f12ee-0fc7-46fb-a487-740cfdf62391\": \"\", \"col_dc1074fa-aab1-4a02-86ef-ee978eaf869f\": \"Submit Budegt\"}', '2025-07-12 15:03:44', '2025-07-12 15:05:00'),
(63, 4, '{\"col_115842d3-9fa5-485a-ac37-c05a038e021e\": \"\", \"col_51adf5c0-954a-4454-93f6-4ea8a9ec4509\": \"new\", \"col_67c60838-a5a7-41c2-a9a7-b689db15599f\": \"2025-08-30\", \"col_977ce958-0532-4e10-9a20-010e498cdb28\": \"\", \"col_dc1074fa-aab1-4a02-86ef-ee978eaf869f\": \"\"}', '2025-07-12 15:05:29', '2025-07-12 15:05:35'),
(64, 4, '{\"col_115842d3-9fa5-485a-ac37-c05a038e021e\": \"\", \"col_51adf5c0-954a-4454-93f6-4ea8a9ec4509\": \"new\", \"col_67c60838-a5a7-41c2-a9a7-b689db15599f\": \"2025-08-30\", \"col_977ce958-0532-4e10-9a20-010e498cdb28\": \"\", \"col_dc1074fa-aab1-4a02-86ef-ee978eaf869f\": \"\"}', '2025-07-12 15:05:32', '2025-07-12 15:05:37'),
(65, 9, '{\"col_12a1c237-3f00-45d5-9541-0858a88feda2\": \"\", \"col_17b7d5d0-6ae9-46c1-a2c0-86e14b999500\": \"\", \"col_39b959d7-f3f3-4b14-a2a1-99b9304f7d9e\": \"March\", \"col_b95f627a-66e6-44a4-b769-949dfeb97533\": \"\", \"col_d68c2f36-dc9a-491b-abb2-61ab47879fca\": \"\", \"col_fd81800a-969e-4f3e-913f-9400e66c1ce8\": \"\"}', '2025-07-12 15:07:39', '2025-07-12 15:07:42'),
(66, 11, '{\"col_2bcf803c-ee7d-49c5-89df-4dd78955350f\": \"08447778\", \"col_31e66b7c-dacf-4061-a628-35f9054dc0aa\": 500, \"col_514b578e-9cc6-4f67-8901-b770308000d9\": \"Gold\", \"col_e23da3f6-a960-47e5-9998-968ba34ecc6d\": \"John\"}', '2025-07-12 16:03:17', '2025-07-12 16:03:29'),
(67, 11, '{\"col_2bcf803c-ee7d-49c5-89df-4dd78955350f\": \"08447778\", \"col_31e66b7c-dacf-4061-a628-35f9054dc0aa\": 800, \"col_514b578e-9cc6-4f67-8901-b770308000d9\": \"Silver\", \"col_e23da3f6-a960-47e5-9998-968ba34ecc6d\": \"Jane\"}', '2025-07-12 16:03:29', '2025-07-12 16:04:00'),
(68, 11, '{\"col_2bcf803c-ee7d-49c5-89df-4dd78955350f\": \"08447778\", \"col_31e66b7c-dacf-4061-a628-35f9054dc0aa\": 500, \"col_514b578e-9cc6-4f67-8901-b770308000d9\": \"Gold\", \"col_e23da3f6-a960-47e5-9998-968ba34ecc6d\": \"Sbu\"}', '2025-07-12 16:03:37', '2025-07-12 16:04:02'),
(69, 11, '{\"col_2bcf803c-ee7d-49c5-89df-4dd78955350f\": \"08447778\", \"col_31e66b7c-dacf-4061-a628-35f9054dc0aa\": 1000, \"col_514b578e-9cc6-4f67-8901-b770308000d9\": \"Planum\", \"col_e23da3f6-a960-47e5-9998-968ba34ecc6d\": \"Kate\"}', '2025-07-12 16:03:38', '2025-07-12 16:04:05');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `website_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `metadata` json DEFAULT NULL,
  `confirmed` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `views`
--

CREATE TABLE `views` (
  `id` int NOT NULL,
  `collection_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `field` varchar(100) DEFAULT NULL,
  `config` json NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `views`
--

INSERT INTO `views` (`id`, `collection_id`, `name`, `type`, `field`, `config`, `created_at`, `updated_at`) VALUES
(4, 1, 'Table', 'table', NULL, '{\"columns\": [\"col_hogkjb9ms\", \"1751858242296\", \"1751861044577\", \"1751862448933\", \"1751863730036\", \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\", \"col_6f8788fa-7ac9-40c3-aaf1-eb19c537e67e\", \"col_481c5ffc-506d-4724-b317-ccefe38b0738\", \"col_4ba568d3-ea44-4242-bcc1-e9b0afc514bd\", \"col_59ff81d8-5c3a-4499-a94b-1b95f799df4b\"], \"filters\": []}', '2025-07-12 03:11:05', '2025-07-12 03:11:05'),
(5, 2, 'Table', 'table', NULL, '{\"columns\": [\"1\", \"col_fa27a524-2583-4b28-a74a-3febd10c952c\", \"col_4dc765f1-20dc-4f15-b761-bfcf90057dd0\"], \"filters\": []}', '2025-07-12 03:19:46', '2025-07-12 03:19:46'),
(6, 5, 'Table', 'table', NULL, '{\"columns\": [\"col_2b164e80-07cb-4366-9fc5-3a2fcadd4722\", \"col_c5451b88-8fc5-402b-8633-b820aa357aa7\", \"col_94d5b447-aaab-45ea-bdec-64225d0844e0\", \"col_ab934677-87a9-4977-bdbe-33ab6758aaa3\", \"col_0b80f0ab-9932-48a1-9cb7-79ac9ff7ccb4\", \"col_52c4e169-7904-495f-9ec7-a8beefbb0c60\"], \"filters\": []}', '2025-07-12 03:28:36', '2025-07-12 03:28:36'),
(7, 6, 'Table', 'table', NULL, '{\"columns\": [\"col_6c232819-6553-4046-9024-ae3c18aa4a08\", \"col_0c65ebe8-6dee-4453-a2ca-951f17274941\", \"col_72ff3b8c-fce6-46c4-821d-cfc65911c7a6\", \"col_87330fdc-ae9f-4a82-ba26-d242fbb81e33\", \"col_b2551437-493d-4840-b21d-349a53f519e8\"], \"filters\": []}', '2025-07-12 03:28:39', '2025-07-12 03:28:39'),
(8, 7, 'Table', 'table', NULL, '{\"columns\": [\"col_ada1ca84-a53f-4c5f-9d8b-b9fa98f62cee\"], \"filters\": []}', '2025-07-12 03:28:40', '2025-07-12 03:28:40'),
(9, 4, 'Table', 'table', NULL, '{\"columns\": [\"col_dc1074fa-aab1-4a02-86ef-ee978eaf869f\", \"col_bf8f12ee-0fc7-46fb-a487-740cfdf62391\", \"col_115842d3-9fa5-485a-ac37-c05a038e021e\", \"col_51adf5c0-954a-4454-93f6-4ea8a9ec4509\"], \"filters\": []}', '2025-07-12 03:28:44', '2025-07-12 03:28:44'),
(10, 3, 'Table', 'table', NULL, '{\"columns\": [\"col_16af25be-9449-4187-8842-6767486e4a0e\", \"col_d39b7eaa-67f3-4ef4-926d-91927d251f5c\", \"col_d64c9ca4-8469-483d-add7-bfc03bf72227\"], \"filters\": []}', '2025-07-12 03:30:09', '2025-07-12 03:30:09'),
(11, 5, 'Category Metrix', 'select-distribution', 'col_c5451b88-8fc5-402b-8633-b820aa357aa7', '{\"columns\": [], \"filters\": []}', '2025-07-12 05:36:16', '2025-07-12 05:37:07'),
(12, 1, 'Status Overview', 'select-distribution', '1751863730036', '{\"columns\": [], \"filters\": []}', '2025-07-12 09:30:39', '2025-07-12 09:30:39'),
(13, 1, 'Turn Over', 'number-summary', '1751862448933', '{\"columns\": [], \"filters\": []}', '2025-07-12 11:48:43', '2025-07-12 11:48:43'),
(14, 1, 'Weeky Progress', 'select-distribution', 'col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb', '{\"columns\": [], \"filters\": []}', '2025-07-12 14:05:15', '2025-07-12 14:05:15'),
(15, 1, 'Reasons', 'select-distribution', 'col_54f78743-2bb4-4646-b93a-32fa5b1d686b', '{\"columns\": [], \"filters\": []}', '2025-07-12 14:09:38', '2025-07-12 14:09:38'),
(16, 1, 'Pending Docs', 'table', '', '{\"columns\": [\"col_hogkjb9ms\", \"1751862448933\", \"1751863730036\", \"col_ddbadfa9-fcb0-496c-bb78-2b54e3b791eb\", \"col_54f78743-2bb4-4646-b93a-32fa5b1d686b\"], \"filters\": []}', '2025-07-12 14:12:05', '2025-07-12 14:12:05'),
(17, 8, 'Table', 'table', '', '{\"columns\": [\"col_20650cd3-9409-4ebb-87ab-4c642f7de9f9\"], \"filters\": []}', '2025-07-12 14:28:19', '2025-07-12 14:28:19'),
(18, 9, 'Table', 'table', '', '{\"columns\": [\"col_d68c2f36-dc9a-491b-abb2-61ab47879fca\"], \"filters\": []}', '2025-07-12 14:49:33', '2025-07-12 14:49:33'),
(19, 10, 'Table', 'table', '', '{\"columns\": [\"col_575c6dbd-968e-4926-acec-9c9e62294d3c\"], \"filters\": []}', '2025-07-12 14:59:09', '2025-07-12 14:59:09'),
(20, 11, 'Table', 'table', '', '{\"columns\": [\"col_e23da3f6-a960-47e5-9998-968ba34ecc6d\"], \"filters\": []}', '2025-07-12 16:01:19', '2025-07-12 16:01:19'),
(21, 11, 'Packages', 'select-distribution', 'col_514b578e-9cc6-4f67-8901-b770308000d9', '{\"columns\": [], \"filters\": []}', '2025-07-12 16:05:13', '2025-07-12 16:05:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `collection_data`
--
ALTER TABLE `collection_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`,`website_id`),
  ADD KEY `idx_website_id` (`website_id`);

--
-- Indexes for table `views`
--
ALTER TABLE `views`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `collection_data`
--
ALTER TABLE `collection_data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `views`
--
ALTER TABLE `views`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
