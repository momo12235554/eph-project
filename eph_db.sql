-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 30 mars 2026 à 20:55
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `eph_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `alertes`
--

CREATE TABLE `alertes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `medicament_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(50) NOT NULL,
  `titre` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `priorite` varchar(20) NOT NULL DEFAULT 'normale',
  `statut` varchar(20) NOT NULL DEFAULT 'active',
  `resolved_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `alertes`
--

INSERT INTO `alertes` (`id`, `medicament_id`, `type`, `titre`, `message`, `priorite`, `statut`, `resolved_at`, `created_at`, `updated_at`) VALUES
(1, 41, 'stock_bas', 'Rupture imminente', 'Stock critique de Morphine 10mg. Commande immédiate nécessaire.', 'haute', 'active', NULL, '2026-03-25 02:01:38', '2026-03-25 02:01:38');

-- --------------------------------------------------------

--
-- Structure de la table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

CREATE TABLE `commandes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fournisseur_id` bigint(20) UNSIGNED NOT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'en_attente',
  `montant_total` decimal(15,2) NOT NULL DEFAULT 0.00,
  `date_commande` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `commandes`
--

INSERT INTO `commandes` (`id`, `fournisseur_id`, `statut`, `montant_total`, `date_commande`, `created_at`, `updated_at`) VALUES
(1, 1, 'livree', 0.00, '2026-03-27 02:00:28', '2026-03-27 01:00:28', '2026-03-27 01:02:12'),
(2, 1, 'livree', 0.00, '2026-03-27 02:00:32', '2026-03-27 01:00:32', '2026-03-27 01:02:16'),
(3, 1, 'en_attente', 0.00, '2026-03-27 02:00:33', '2026-03-27 01:00:33', '2026-03-27 01:00:33'),
(4, 1, 'livree', 0.00, '2026-03-27 02:00:34', '2026-03-27 01:00:34', '2026-03-27 01:02:08'),
(5, 1, 'livree', 0.00, '2026-03-27 02:00:35', '2026-03-27 01:00:35', '2026-03-27 01:02:04'),
(6, 1, 'livree', 0.00, '2026-03-27 02:00:36', '2026-03-27 01:00:36', '2026-03-27 01:02:00'),
(7, 1, 'livree', 0.00, '2026-03-27 02:00:36', '2026-03-27 01:00:36', '2026-03-27 01:01:59'),
(8, 1, 'livree', 0.00, '2026-03-27 02:00:37', '2026-03-27 01:00:37', '2026-03-27 01:02:03'),
(9, 1, 'en_attente', 0.00, '2026-03-27 02:00:37', '2026-03-27 01:00:37', '2026-03-27 01:00:37'),
(10, 1, 'en_attente', 0.00, '2026-03-27 02:00:38', '2026-03-27 01:00:38', '2026-03-27 01:00:38');

-- --------------------------------------------------------

--
-- Structure de la table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fournisseurs`
--

CREATE TABLE `fournisseurs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(200) NOT NULL,
  `contact_personne` varchar(150) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `adresse` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `fournisseurs`
--

INSERT INTO `fournisseurs` (`id`, `nom`, `contact_personne`, `email`, `telephone`, `adresse`) VALUES
(1, 'PharmAlliance Algérie', 'M. BENAMEUR', 'contact@pharmalliance.dz', '021 00 11 22', 'Zone Industrielle, Alger');

-- --------------------------------------------------------

--
-- Structure de la table `historique`
--

CREATE TABLE `historique` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(50) NOT NULL,
  `details` text DEFAULT NULL,
  `date_action` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `historique`
--

INSERT INTO `historique` (`id`, `user_id`, `action`, `details`, `date_action`) VALUES
(1, 1, 'création', 'Initialisation de l\'inventaire et des ordonnances.', '2026-03-23 02:01:38'),
(2, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Medicament\' (ID: 43)', '2026-03-27 00:19:11'),
(3, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Medicament\' (ID: 44)', '2026-03-27 00:19:12'),
(4, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Medicament\' (ID: 45)', '2026-03-27 00:19:12'),
(5, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Medicament\' (ID: 46)', '2026-03-27 00:37:28'),
(6, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 1)', '2026-03-27 02:00:28'),
(7, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 2)', '2026-03-27 02:00:32'),
(8, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 3)', '2026-03-27 02:00:33'),
(9, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 4)', '2026-03-27 02:00:34'),
(10, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 5)', '2026-03-27 02:00:35'),
(11, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 6)', '2026-03-27 02:00:36'),
(12, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 7)', '2026-03-27 02:00:36'),
(13, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 8)', '2026-03-27 02:00:37'),
(14, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 9)', '2026-03-27 02:00:37'),
(15, 2, 'création', 'Action \'création\' effectuée sur le modèle \'Commande\' (ID: 10)', '2026-03-27 02:00:38'),
(16, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Commande\' (ID: 7)', '2026-03-27 02:01:59'),
(17, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Medicament\' (ID: 14)', '2026-03-27 02:01:59'),
(18, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Commande\' (ID: 6)', '2026-03-27 02:02:00'),
(19, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Medicament\' (ID: 14)', '2026-03-27 02:02:00'),
(20, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Commande\' (ID: 8)', '2026-03-27 02:02:03'),
(21, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Medicament\' (ID: 14)', '2026-03-27 02:02:03'),
(22, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Commande\' (ID: 5)', '2026-03-27 02:02:04'),
(23, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Medicament\' (ID: 14)', '2026-03-27 02:02:04'),
(24, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Commande\' (ID: 4)', '2026-03-27 02:02:08'),
(25, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Medicament\' (ID: 14)', '2026-03-27 02:02:08'),
(26, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Commande\' (ID: 1)', '2026-03-27 02:02:12'),
(27, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Medicament\' (ID: 14)', '2026-03-27 02:02:12'),
(28, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Commande\' (ID: 2)', '2026-03-27 02:02:16'),
(29, 2, 'modification', 'Action \'modification\' effectuée sur le modèle \'Medicament\' (ID: 14)', '2026-03-27 02:02:16');

-- --------------------------------------------------------

--
-- Structure de la table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ligne_commandes`
--

CREATE TABLE `ligne_commandes` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `commande_id` bigint(20) UNSIGNED NOT NULL,
  `medicament_id` bigint(20) UNSIGNED NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix_unitaire` decimal(15,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ligne_commandes`
--

INSERT INTO `ligne_commandes` (`id`, `commande_id`, `medicament_id`, `quantite`, `prix_unitaire`, `created_at`, `updated_at`) VALUES
(1, 1, 14, 23, 0.00, '2026-03-27 01:00:28', '2026-03-27 01:00:28'),
(2, 2, 14, 23, 0.00, '2026-03-27 01:00:32', '2026-03-27 01:00:32'),
(3, 3, 14, 23, 0.00, '2026-03-27 01:00:33', '2026-03-27 01:00:33'),
(4, 4, 14, 23, 0.00, '2026-03-27 01:00:34', '2026-03-27 01:00:34'),
(5, 5, 14, 23, 0.00, '2026-03-27 01:00:35', '2026-03-27 01:00:35'),
(6, 6, 14, 23, 0.00, '2026-03-27 01:00:36', '2026-03-27 01:00:36'),
(7, 7, 14, 23, 0.00, '2026-03-27 01:00:36', '2026-03-27 01:00:36'),
(8, 8, 14, 23, 0.00, '2026-03-27 01:00:37', '2026-03-27 01:00:37'),
(9, 9, 14, 23, 0.00, '2026-03-27 01:00:37', '2026-03-27 01:00:37'),
(10, 10, 14, 23, 0.00, '2026-03-27 01:00:38', '2026-03-27 01:00:38');

-- --------------------------------------------------------

--
-- Structure de la table `livraisons`
--

CREATE TABLE `livraisons` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `commande_id` bigint(20) UNSIGNED NOT NULL,
  `recu_par` bigint(20) UNSIGNED NOT NULL,
  `date_reception` timestamp NOT NULL DEFAULT current_timestamp(),
  `commentaire` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `medicaments`
--

CREATE TABLE `medicaments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(200) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `code_barre` varchar(100) DEFAULT NULL,
  `lot` varchar(100) NOT NULL,
  `prix` decimal(10,2) NOT NULL DEFAULT 0.00,
  `quantite` int(11) NOT NULL DEFAULT 0,
  `date_expiration` date DEFAULT NULL,
  `categorie` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `medicaments`
--

INSERT INTO `medicaments` (`id`, `nom`, `code`, `code_barre`, `lot`, `prix`, `quantite`, `date_expiration`, `categorie`, `created_at`, `updated_at`) VALUES
(1, 'Tramadol 50mg (Lot 1)', NULL, NULL, 'LOT-2024-000', 775.00, 153, '2026-11-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(2, 'Amlodipine 5mg (Lot 2)', NULL, NULL, 'LOT-2024-001', 1496.00, 184, '2027-02-25', 'Antidiabétique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(3, 'Atorvastatine 20mg (Lot 3)', NULL, NULL, 'LOT-2024-002', 935.00, 56, '2027-02-25', 'Antibiotique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(4, 'Amoxicilline 1g (Lot 4)', NULL, NULL, 'LOT-2024-003', 1295.00, 153, '2027-03-25', 'Antihypertenseur', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(5, 'Losartan 50mg (Lot 5)', NULL, NULL, 'LOT-2024-004', 842.00, 120, '2027-02-25', 'Antalgique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(6, 'Prednisolone 20mg (Lot 6)', NULL, NULL, 'LOT-2024-005', 1447.00, 190, '2026-09-25', 'Antihypertenseur', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(7, 'Ibuprofène 400mg (Lot 7)', NULL, NULL, 'LOT-2024-006', 545.00, 83, '2026-11-25', 'Antibiotique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(8, 'Paracétamol 500mg (Lot 8)', NULL, NULL, 'LOT-2024-007', 590.00, 84, '2027-06-25', 'Antibiotique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(9, 'Ciprofloxacine 500mg (Lot 9)', NULL, NULL, 'LOT-2024-008', 599.00, 173, '2027-05-25', 'Antibiotique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(10, 'Losartan 50mg (Lot 10)', NULL, NULL, 'LOT-2024-009', 1115.00, 97, '2026-11-25', 'Antibiotique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(11, 'Tramadol 50mg (Lot 11)', NULL, NULL, 'LOT-2024-010', 352.00, 75, '2027-12-25', 'Antidiabétique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(12, 'Amlodipine 5mg (Lot 12)', NULL, NULL, 'LOT-2024-011', 1054.00, 74, '2028-01-25', 'Antihypertenseur', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(13, 'Atorvastatine 20mg (Lot 13)', NULL, NULL, 'LOT-2024-012', 1199.00, 158, '2027-02-25', 'Antalgique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(14, 'Doliprane 1000mg (Lot 14)', NULL, NULL, 'LOT-2024-013', 577.00, 288, '2026-12-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-27 01:02:16'),
(15, 'Ibuprofène 400mg (Lot 15)', NULL, NULL, 'LOT-2024-014', 418.00, 137, '2026-10-25', 'Antidiabétique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(16, 'Ibuprofène 400mg (Lot 16)', NULL, NULL, 'LOT-2024-015', 788.00, 130, '2026-12-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(17, 'Amoxicilline 1g (Lot 17)', NULL, NULL, 'LOT-2024-016', 641.00, 123, '2026-10-25', 'Antalgique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(18, 'Azithromycine 250mg (Lot 18)', NULL, NULL, 'LOT-2024-017', 252.00, 55, '2028-03-25', 'Antihypertenseur', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(19, 'Amlodipine 5mg (Lot 19)', NULL, NULL, 'LOT-2024-018', 302.00, 60, '2026-10-25', 'Antibiotique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(20, 'Losartan 50mg (Lot 20)', NULL, NULL, 'LOT-2024-019', 223.00, 134, '2026-12-25', 'Antidiabétique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(21, 'Clopidogrel 75mg (Lot 21)', NULL, NULL, 'LOT-2024-020', 248.00, 174, '2026-10-25', 'Antihypertenseur', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(22, 'Metformine 850mg (Lot 22)', NULL, NULL, 'LOT-2024-021', 548.00, 176, '2027-02-25', 'Antihypertenseur', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(23, 'Ibuprofène 400mg (Lot 23)', NULL, NULL, 'LOT-2024-022', 596.00, 127, '2027-12-25', 'Antalgique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(24, 'Paracétamol 500mg (Lot 24)', NULL, NULL, 'LOT-2024-023', 599.00, 92, '2027-12-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(25, 'Amoxicilline 1g (Lot 25)', NULL, NULL, 'LOT-2024-024', 1473.00, 130, '2027-10-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(26, 'Doliprane 1000mg (Lot 26)', NULL, NULL, 'LOT-2024-025', 776.00, 78, '2026-09-25', 'Antalgique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(27, 'Azithromycine 250mg (Lot 27)', NULL, NULL, 'LOT-2024-026', 902.00, 138, '2027-09-25', 'Antalgique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(28, 'Atorvastatine 20mg (Lot 28)', NULL, NULL, 'LOT-2024-027', 898.00, 172, '2028-01-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(29, 'Levothyroxine 100mcg (Lot 29)', NULL, NULL, 'LOT-2024-028', 1042.00, 82, '2027-07-25', 'Antalgique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(30, 'Prednisolone 20mg (Lot 30)', NULL, NULL, 'LOT-2024-029', 949.00, 98, '2026-12-25', 'Antidiabétique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(31, 'Ibuprofène 400mg (Lot 31)', NULL, NULL, 'LOT-2024-030', 842.00, 195, '2026-12-25', 'Antalgique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(32, 'Amoxicilline 1g (Lot 32)', NULL, NULL, 'LOT-2024-031', 802.00, 153, '2027-12-25', 'Antibiotique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(33, 'Ibuprofène 400mg (Lot 33)', NULL, NULL, 'LOT-2024-032', 942.00, 163, '2027-07-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(34, 'Azithromycine 250mg (Lot 34)', NULL, NULL, 'LOT-2024-033', 1050.00, 90, '2027-02-25', 'Antihypertenseur', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(35, 'Prednisolone 20mg (Lot 35)', NULL, NULL, 'LOT-2024-034', 712.00, 114, '2027-04-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(36, 'Losartan 50mg (Lot 36)', NULL, NULL, 'LOT-2024-035', 397.00, 116, '2026-12-25', 'Antalgique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(37, 'Levothyroxine 100mcg (Lot 37)', NULL, NULL, 'LOT-2024-036', 1091.00, 100, '2026-11-25', 'Antihypertenseur', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(38, 'Azithromycine 250mg (Lot 38)', NULL, NULL, 'LOT-2024-037', 1187.00, 168, '2027-01-25', 'Antihypertenseur', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(39, 'Ciprofloxacine 500mg (Lot 39)', NULL, NULL, 'LOT-2024-038', 489.00, 111, '2027-10-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(40, 'Tramadol 50mg (Lot 40)', NULL, NULL, 'LOT-2024-039', 398.00, 150, '2027-01-25', 'Anti-inflammatoire', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(41, 'Morphine 10mg (Stock Critique)', NULL, NULL, 'LOT-URGENT-001', 2500.00, 4, '2027-03-25', 'Analgésique Opioïde', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(42, 'Insuline Glargine (Expire bientôt)', NULL, NULL, 'EXP-JUL-24', 3200.00, 45, '2026-03-30', 'Antidiabétique', '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(43, 'doliprane', NULL, NULL, 'LOT-2024-007', 0.00, 2, '2026-12-25', NULL, '2026-03-26 23:19:11', '2026-03-26 23:19:11'),
(44, 'doliprane', NULL, NULL, 'LOT-2024-007', 0.00, 2, '2026-12-25', NULL, '2026-03-26 23:19:12', '2026-03-26 23:19:12'),
(45, 'doliprane', NULL, NULL, 'LOT-2024-007', 0.00, 2, '2026-12-25', NULL, '2026-03-26 23:19:12', '2026-03-26 23:19:12'),
(46, 'Doliprane', NULL, NULL, 'LOT-2024-008', 0.00, 3, '2027-12-31', NULL, '2026-03-26 23:37:28', '2026-03-26 23:37:28');

-- --------------------------------------------------------

--
-- Structure de la table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_03_24_235137_create_personal_access_tokens_table', 1),
(5, '2026_03_25_020833_create_ordonnances_table', 1),
(6, '2026_03_25_021126_create_medicaments_table', 1),
(7, '2026_03_25_021127_create_alertes_table', 1),
(8, '2026_03_25_021128_create_fournisseurs_table', 1),
(9, '2026_03_25_021128_create_historiques_table', 1),
(10, '2026_03_25_021220_create_commandes_table', 1),
(11, '2026_03_25_021221_create_ligne_commandes_table', 1),
(12, '2026_03_25_021221_create_livraisons_table', 1),
(13, '2026_03_25_021544_create_notifications_table', 1),
(14, '2026_03_27_013239_add_medicaments_to_ordonnances_table', 2);

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `medicament_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'info',
  `message` text NOT NULL,
  `lu` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ordonnances`
--

CREATE TABLE `ordonnances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `numero_ordonnance` varchar(255) NOT NULL,
  `patient_nom` varchar(255) NOT NULL,
  `patient_prenom` varchar(255) NOT NULL,
  `medecin_nom` varchar(255) NOT NULL,
  `date_prescription` date NOT NULL,
  `statut` varchar(255) NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `medicaments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`medicaments`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `ordonnances`
--

INSERT INTO `ordonnances` (`id`, `numero_ordonnance`, `patient_nom`, `patient_prenom`, `medecin_nom`, `date_prescription`, `statut`, `created_at`, `updated_at`, `medicaments`) VALUES
(1, 'ORD-2024-001', 'BENTORKI', 'Fatima', 'Dr. BENALI', '2026-03-23', 'terminée', NULL, NULL, NULL),
(2, 'ORD-2024-002', 'HAMIDI', 'Karim', 'Dr. INESS', '2026-03-24', 'en_attente', NULL, NULL, NULL),
(3, 'ORD-2024-003', 'MAHRANE', 'Yacine', 'Dr. SAID', '2026-03-25', 'en_attente', NULL, NULL, NULL),
(4, 'ORD-2025-098', 'Belrhali', '-', 'INESS', '2026-03-27', 'en_attente', NULL, NULL, NULL),
(5, 'ORD-2026-223', 'Vittori', '-', 'iness', '2026-03-27', 'en_attente', NULL, NULL, '[{\"medicament_id\":12,\"quantite\":\"1\",\"posologie\":null,\"medicament_nom\":\"Amlodipine 5mg (Lot 12)\"}]');

-- --------------------------------------------------------

--
-- Structure de la table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(33, 'App\\Models\\User', 1, 'auth_token', 'e9cffb9d22d0e0fc12cb3f52c7fa0cdfacd29f7a6cc3d0b6136e775f1ed5a4bc', '[\"*\"]', '2026-03-30 16:47:39', NULL, '2026-03-30 15:59:36', '2026-03-30 16:47:39'),
(35, 'App\\Models\\User', 2, 'auth_token', 'eaff57dbc93b4c2001855164edbf2939aeb08f69085f17b961971a658d827784', '[\"*\"]', '2026-03-30 16:49:31', NULL, '2026-03-30 16:49:30', '2026-03-30 16:49:31'),
(36, 'App\\Models\\User', 3, 'auth_token', '6495c40879d448d46b687c7ecfb44f7349901b133ffaa1ab7a43aa46baa0374b', '[\"*\"]', '2026-03-30 16:50:14', NULL, '2026-03-30 16:50:13', '2026-03-30 16:50:14');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'pharmacien',
  `service` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `nom`, `prenom`, `email`, `password`, `role`, `service`, `telephone`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'MEDI-ADMIN', 'Directeur', 'admin@medistock.dz', '$2y$12$700mBezvbxCleIvpDguzKOnffBshaB77frALxL7pU/yLsnetlHBOS', 'admin', NULL, NULL, NULL, '2026-03-25 02:01:37', '2026-03-25 02:01:37'),
(2, 'BENAMEUR', 'Iness', 'iness.benameur@chu.dz', '$2y$12$fLQMCCoIbptrPWsUWN7ctOqB5IKec3u.XfIP2ymgVd3e9b8o3IdvC', 'pharmacien', 'Pharmacie Centrale', NULL, NULL, '2026-03-25 02:01:38', '2026-03-25 02:01:38'),
(3, 'PharmAlliance', 'Service Commercial', 'contact@pharmalliance.dz', '$2y$12$hN6nDHhhMe2HxZtLhXERa.Z52obn8OxHdnctDrpqr9OpWhxA20UUG', 'fournisseur', NULL, NULL, NULL, '2026-03-25 02:01:38', '2026-03-25 02:01:38');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `alertes`
--
ALTER TABLE `alertes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alertes_medicament_id_foreign` (`medicament_id`);

--
-- Index pour la table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Index pour la table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Index pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `commandes_fournisseur_id_foreign` (`fournisseur_id`);

--
-- Index pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Index pour la table `fournisseurs`
--
ALTER TABLE `fournisseurs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `historique`
--
ALTER TABLE `historique`
  ADD PRIMARY KEY (`id`),
  ADD KEY `historique_user_id_foreign` (`user_id`);

--
-- Index pour la table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Index pour la table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `ligne_commandes`
--
ALTER TABLE `ligne_commandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ligne_commandes_commande_id_foreign` (`commande_id`),
  ADD KEY `ligne_commandes_medicament_id_foreign` (`medicament_id`);

--
-- Index pour la table `livraisons`
--
ALTER TABLE `livraisons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `livraisons_commande_id_foreign` (`commande_id`),
  ADD KEY `livraisons_recu_par_foreign` (`recu_par`);

--
-- Index pour la table `medicaments`
--
ALTER TABLE `medicaments`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_user_id_foreign` (`user_id`),
  ADD KEY `notifications_medicament_id_foreign` (`medicament_id`);

--
-- Index pour la table `ordonnances`
--
ALTER TABLE `ordonnances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ordonnances_numero_ordonnance_unique` (`numero_ordonnance`);

--
-- Index pour la table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Index pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Index pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `alertes`
--
ALTER TABLE `alertes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `fournisseurs`
--
ALTER TABLE `fournisseurs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `historique`
--
ALTER TABLE `historique`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT pour la table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ligne_commandes`
--
ALTER TABLE `ligne_commandes`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `livraisons`
--
ALTER TABLE `livraisons`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `medicaments`
--
ALTER TABLE `medicaments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT pour la table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `ordonnances`
--
ALTER TABLE `ordonnances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `alertes`
--
ALTER TABLE `alertes`
  ADD CONSTRAINT `alertes_medicament_id_foreign` FOREIGN KEY (`medicament_id`) REFERENCES `medicaments` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `commandes_fournisseur_id_foreign` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `historique`
--
ALTER TABLE `historique`
  ADD CONSTRAINT `historique_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ligne_commandes`
--
ALTER TABLE `ligne_commandes`
  ADD CONSTRAINT `ligne_commandes_commande_id_foreign` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ligne_commandes_medicament_id_foreign` FOREIGN KEY (`medicament_id`) REFERENCES `medicaments` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `livraisons`
--
ALTER TABLE `livraisons`
  ADD CONSTRAINT `livraisons_commande_id_foreign` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `livraisons_recu_par_foreign` FOREIGN KEY (`recu_par`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_medicament_id_foreign` FOREIGN KEY (`medicament_id`) REFERENCES `medicaments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
