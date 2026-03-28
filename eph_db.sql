-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 23 mars 2026 à 22:52
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28

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

DROP TABLE IF EXISTS `alertes`;
CREATE TABLE IF NOT EXISTS `alertes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medicament_id` int DEFAULT NULL,
  `titre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `priorite` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'moyenne',
  `statut` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `medicament_id` (`medicament_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `alertes`
--

INSERT INTO `alertes` (`id`, `type`, `medicament_id`, `titre`, `message`, `priorite`, `statut`, `created_at`, `resolved_at`) VALUES
(1, 'autre', NULL, 'Signalement Fournisseur', 'TEST PS SUCCESS - Double Signalement', 'moyenne', 'active', '2026-03-18 04:51:15', NULL),
(2, 'autre', 36, 'Signalement Pharmacien', 'SIGNALEMENT PHARMACIEN - Médicament: Allopurinol 100mg, Quantité: 8, Message: Allopurinol 100mg - Stock restant: 8 unités', 'moyenne', 'active', '2026-03-18 05:47:50', NULL),
(3, 'autre', 40, 'Signalement Pharmacien', 'SIGNALEMENT PHARMACIEN - Médicament: Clonazépam 2mg, Quantité: 6, Message: Clonazépam 2mg - Stock restant: 6 unités', 'moyenne', 'active', '2026-03-18 05:47:54', NULL),
(4, 'autre', 25, 'Signalement Pharmacien', 'SIGNALEMENT PHARMACIEN - Médicament: Diclofénac 50mg, Quantité: 4, Message: Diclofénac 50mg - Stock restant: 4 unités', 'moyenne', 'active', '2026-03-18 05:48:00', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
CREATE TABLE IF NOT EXISTS `commandes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fournisseur_id` int DEFAULT NULL,
  `date_commande` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `statut` enum('en_attente','validee','livree','annulee') COLLATE utf8mb4_unicode_ci DEFAULT 'en_attente',
  `montant_total` decimal(12,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `fournisseur_id` (`fournisseur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `fournisseurs`
--

DROP TABLE IF EXISTS `fournisseurs`;
CREATE TABLE IF NOT EXISTS `fournisseurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_personne` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `adresse` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `fournisseurs`
--

INSERT INTO `fournisseurs` (`id`, `nom`, `contact_personne`, `email`, `telephone`, `adresse`, `created_at`) VALUES
(1, 'PharmaCorp Algeria', NULL, 'contact@pharmacorp.dz', '021 00 00 00', NULL, '2026-03-18 04:47:22'),
(2, 'BioMed Supplies', NULL, 'sales@biomed.dz', '023 11 11 11', NULL, '2026-03-18 04:47:22');

-- --------------------------------------------------------

--
-- Structure de la table `historique`
--

DROP TABLE IF EXISTS `historique`;
CREATE TABLE IF NOT EXISTS `historique` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `date_action` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `ligne_commandes`
--

DROP TABLE IF EXISTS `ligne_commandes`;
CREATE TABLE IF NOT EXISTS `ligne_commandes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commande_id` int DEFAULT NULL,
  `medicament_id` int DEFAULT NULL,
  `quantite` int NOT NULL,
  `prix_unitaire` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `commande_id` (`commande_id`),
  KEY `medicament_id` (`medicament_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `livraisons`
--

DROP TABLE IF EXISTS `livraisons`;
CREATE TABLE IF NOT EXISTS `livraisons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `commande_id` int DEFAULT NULL,
  `recu_par` int DEFAULT NULL,
  `date_reception` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `commentaire` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `commande_id` (`commande_id`),
  KEY `recu_par` (`recu_par`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `medicaments`
--

DROP TABLE IF EXISTS `medicaments`;
CREATE TABLE IF NOT EXISTS `medicaments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code_barre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lot` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prix` decimal(10,2) DEFAULT '0.00',
  `quantite` int DEFAULT '0',
  `date_expiration` date DEFAULT NULL,
  `categorie` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `medicaments`
--

INSERT INTO `medicaments` (`id`, `nom`, `code`, `code_barre`, `lot`, `prix`, `quantite`, `date_expiration`, `categorie`, `created_at`) VALUES
(1, 'Parac??tamol 500mg', 'PARA-001', NULL, 'LOT2024001', 5.50, 8, '2025-06-15', 'Analg??sique', '2026-03-18 04:47:22'),
(2, 'Amoxicilline 1g', 'AMOX-002', NULL, 'LOT2024002', 12.00, 45, '2025-08-20', 'Antibiotique', '2026-03-18 04:47:22'),
(3, 'Paracétamol 500mg', NULL, NULL, 'LOT2024001', 0.00, 8, '2025-06-15', 'Antalgique', '2026-03-18 04:56:52'),
(4, 'Amoxicilline 1g', NULL, NULL, 'LOT2024002', 0.00, 45, '2025-08-20', 'Antibiotique', '2026-03-18 04:56:52'),
(5, 'Ibuprofène 400mg', NULL, NULL, 'LOT2024003', 0.00, 120, '2026-01-10', 'Anti-inflammatoire', '2026-03-18 04:56:52'),
(6, 'Aspirine 100mg', NULL, NULL, 'LOT2024004', 0.00, 6, '2025-05-22', 'Antiagrégant', '2026-03-18 04:56:52'),
(7, 'Doliprane 1000mg', NULL, NULL, 'LOT2024005', 0.00, 95, '2025-12-30', 'Antalgique', '2026-03-18 04:56:52'),
(8, 'Azithromycine 250mg', NULL, NULL, 'LOT2024006', 0.00, 32, '2025-09-15', 'Antibiotique', '2026-03-18 04:56:52'),
(9, 'Oméprazole 20mg', NULL, NULL, 'LOT2024007', 0.00, 78, '2026-03-10', 'Anti-ulcéreux', '2026-03-18 04:56:52'),
(10, 'Metformine 850mg', NULL, NULL, 'LOT2024008', 0.00, 150, '2026-07-25', 'Antidiabétique', '2026-03-18 04:56:52'),
(11, 'Atorvastatine 20mg', NULL, NULL, 'LOT2024009', 0.00, 88, '2025-11-18', 'Hypolipémiant', '2026-03-18 04:56:52'),
(12, 'Losartan 50mg', NULL, NULL, 'LOT2024010', 0.00, 5, '2025-04-30', 'Antihypertenseur', '2026-03-18 04:56:52'),
(13, 'Amlodipine 5mg', NULL, NULL, 'LOT2024011', 0.00, 110, '2026-02-14', 'Antihypertenseur', '2026-03-18 04:56:52'),
(14, 'Clopidogrel 75mg', NULL, NULL, 'LOT2024012', 0.00, 64, '2025-10-08', 'Antiagrégant', '2026-03-18 04:56:52'),
(15, 'Levothyroxine 100mcg', NULL, NULL, 'LOT2024013', 0.00, 92, '2026-05-20', 'Hormone thyroïdienne', '2026-03-18 04:56:52'),
(16, 'Tramadol 50mg', NULL, NULL, 'LOT2024014', 0.00, 7, '2025-07-12', 'Antalgique opioïde', '2026-03-18 04:56:52'),
(17, 'Ciprofloxacine 500mg', NULL, NULL, 'LOT2024015', 0.00, 41, '2025-09-28', 'Antibiotique', '2026-03-18 04:56:52'),
(18, 'Prednisolone 20mg', NULL, NULL, 'LOT2024016', 0.00, 55, '2026-01-05', 'Corticoïde', '2026-03-18 04:56:52'),
(19, 'Salbutamol 100mcg', NULL, NULL, 'LOT2024017', 0.00, 73, '2025-12-15', 'Bronchodilatateur', '2026-03-18 04:56:52'),
(20, 'Lorazépam 1mg', NULL, NULL, 'LOT2024018', 0.00, 28, '2025-08-30', 'Anxiolytique', '2026-03-18 04:56:52'),
(21, 'Sertraline 50mg', NULL, NULL, 'LOT2024019', 0.00, 9, '2025-06-22', 'Antidépresseur', '2026-03-18 04:56:52'),
(22, 'Furosémide 40mg', NULL, NULL, 'LOT2024020', 0.00, 67, '2026-04-18', 'Diurétique', '2026-03-18 04:56:52'),
(23, 'Ranitidine 150mg', NULL, NULL, 'LOT2024021', 0.00, 84, '2025-11-25', 'Anti-ulcéreux', '2026-03-18 04:56:52'),
(24, 'Cétirizine 10mg', NULL, NULL, 'LOT2024022', 0.00, 135, '2026-06-30', 'Antihistaminique', '2026-03-18 04:56:52'),
(25, 'Diclofénac 50mg', NULL, NULL, 'LOT2024023', 0.00, 4, '2025-05-10', 'Anti-inflammatoire', '2026-03-18 04:56:52'),
(26, 'Warfarine 5mg', NULL, NULL, 'LOT2024024', 0.00, 52, '2025-10-20', 'Anticoagulant', '2026-03-18 04:56:52'),
(27, 'Insuline Glargine', NULL, NULL, 'LOT2024025', 0.00, 18, '2025-07-05', 'Antidiabétique', '2026-03-18 04:56:52'),
(28, 'Enalapril 10mg', NULL, NULL, 'LOT2024026', 0.00, 98, '2026-02-28', 'Antihypertenseur', '2026-03-18 04:56:52'),
(29, 'Bisoprolol 5mg', NULL, NULL, 'LOT2024027', 0.00, 76, '2025-12-08', 'Bêta-bloquant', '2026-03-18 04:56:52'),
(30, 'Morphine 10mg', NULL, NULL, 'LOT2024028', 0.00, 3, '2025-04-15', 'Antalgique opioïde', '2026-03-18 04:56:52'),
(31, 'Codéine 30mg', NULL, NULL, 'LOT2024029', 0.00, 58, '2025-09-12', 'Antalgique opioïde', '2026-03-18 04:56:52'),
(32, 'Doxycycline 100mg', NULL, NULL, 'LOT2024030', 0.00, 89, '2026-03-22', 'Antibiotique', '2026-03-18 04:56:52'),
(33, 'Clarithromycine 500mg', NULL, NULL, 'LOT2024031', 0.00, 44, '2025-11-10', 'Antibiotique', '2026-03-18 04:56:52'),
(34, 'Pantoprazole 40mg', NULL, NULL, 'LOT2024032', 0.00, 102, '2026-05-15', 'Anti-ulcéreux', '2026-03-18 04:56:52'),
(35, 'Simvastatine 20mg', NULL, NULL, 'LOT2024033', 0.00, 71, '2025-10-30', 'Hypolipémiant', '2026-03-18 04:56:52'),
(36, 'Allopurinol 100mg', NULL, NULL, 'LOT2024034', 0.00, 8, '2025-06-18', 'Antigouteux', '2026-03-18 04:56:52'),
(37, 'Spironolactone 25mg', NULL, NULL, 'LOT2024035', 0.00, 63, '2026-01-28', 'Diurétique', '2026-03-18 04:56:52'),
(38, 'Fluoxétine 20mg', NULL, NULL, 'LOT2024036', 0.00, 95, '2025-12-20', 'Antidépresseur', '2026-03-18 04:56:52'),
(39, 'Alprazolam 0.5mg', NULL, NULL, 'LOT2024037', 0.00, 37, '2025-08-15', 'Anxiolytique', '2026-03-18 04:56:52'),
(40, 'Clonazépam 2mg', NULL, NULL, 'LOT2024038', 0.00, 6, '2025-05-28', 'Antiépileptique', '2026-03-18 04:56:52'),
(41, 'Gabapentine 300mg', NULL, NULL, 'LOT2024039', 0.00, 81, '2026-04-10', 'Antiépileptique', '2026-03-18 04:56:52'),
(42, 'Lévétiracétam 500mg', NULL, NULL, 'LOT2024040', 0.00, 54, '2025-11-05', 'Antiépileptique', '2026-03-18 04:56:52'),
(43, 'Montelukast 10mg', NULL, NULL, 'LOT2024041', 0.00, 118, '2026-07-12', 'Antiasthmatique', '2026-03-18 04:56:52'),
(44, 'Budesonide 200mcg', NULL, NULL, 'LOT2024042', 0.00, 69, '2025-10-18', 'Corticoïde inhalé', '2026-03-18 04:56:52'),
(45, 'Hydroxyzine 25mg', NULL, NULL, 'LOT2024043', 0.00, 5, '2025-04-25', 'Antihistaminique', '2026-03-18 04:56:52'),
(46, 'Mirtazapine 15mg', NULL, NULL, 'LOT2024044', 0.00, 47, '2025-09-08', 'Antidépresseur', '2026-03-18 04:56:52'),
(47, 'Venlafaxine 75mg', NULL, NULL, 'LOT2024045', 0.00, 92, '2026-02-15', 'Antidépresseur', '2026-03-18 04:56:52'),
(48, 'Colchicine 1mg', NULL, NULL, 'LOT2024046', 0.00, 33, '2025-07-30', 'Antigouteux', '2026-03-18 04:56:52'),
(49, 'Digoxine 0.25mg', NULL, NULL, 'LOT2024047', 0.00, 9, '2025-06-05', 'Cardiotonique', '2026-03-18 04:56:52'),
(50, 'Isosorbide 20mg', NULL, NULL, 'LOT2024048', 0.00, 76, '2026-03-18', 'Vasodilatateur', '2026-03-18 04:56:52'),
(51, 'Nitroglycérine 0.5mg', NULL, NULL, 'LOT2024049', 0.00, 61, '2025-11-28', 'Vasodilatateur', '2026-03-18 04:56:52'),
(52, 'Héparine 5000UI', NULL, NULL, 'LOT2024050', 0.00, 7, '2025-05-12', 'Anticoagulant', '2026-03-18 04:56:52');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `medicament_id` int DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'signalement',
  `lu` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `medicament_id` (`medicament_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `medicament_id`, `message`, `type`, `lu`, `created_at`) VALUES
(2, 3, NULL, 'TEST PS SUCCESS - Double Signalement', 'signalement', 0, '2026-03-18 04:51:15'),
(3, 2, 36, 'SIGNALEMENT PHARMACIEN - Médicament: Allopurinol 100mg, Quantité: 8, Message: Allopurinol 100mg - Stock restant: 8 unités', 'signalement', 0, '2026-03-18 05:47:50'),
(4, 2, 40, 'SIGNALEMENT PHARMACIEN - Médicament: Clonazépam 2mg, Quantité: 6, Message: Clonazépam 2mg - Stock restant: 6 unités', 'signalement', 0, '2026-03-18 05:47:54'),
(5, 2, 25, 'SIGNALEMENT PHARMACIEN - Médicament: Diclofénac 50mg, Quantité: 4, Message: Diclofénac 50mg - Stock restant: 4 unités', 'signalement', 0, '2026-03-18 05:48:00');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','pharmacien','fournisseur') COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prenom` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `nom`, `prenom`, `email`, `created_at`) VALUES
(1, 'admin', 'password', 'admin', 'Administrateur', 'Principal', 'admin@chu.dz', '2026-03-18 04:47:22'),
(2, 'pharmacien', 'password', 'pharmacien', 'Benameur', 'Iness', 'iness@chu.dz', '2026-03-18 04:47:22'),
(3, 'supplier', 'password', 'fournisseur', 'PharmaCorp', 'Contact', 'supplier@chu.dz', '2026-03-18 04:47:22'),
(4, 'mohammed', 'momo123', '', NULL, NULL, NULL, '2026-03-18 05:19:55'),
(5, '', '', 'fournisseur', NULL, NULL, NULL, '2026-03-18 05:19:55');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `alertes`
--
ALTER TABLE `alertes`
  ADD CONSTRAINT `alertes_ibfk_1` FOREIGN KEY (`medicament_id`) REFERENCES `medicaments` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `commandes_ibfk_1` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `historique`
--
ALTER TABLE `historique`
  ADD CONSTRAINT `historique_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `ligne_commandes`
--
ALTER TABLE `ligne_commandes`
  ADD CONSTRAINT `ligne_commandes_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ligne_commandes_ibfk_2` FOREIGN KEY (`medicament_id`) REFERENCES `medicaments` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `livraisons`
--
ALTER TABLE `livraisons`
  ADD CONSTRAINT `livraisons_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `livraisons_ibfk_2` FOREIGN KEY (`recu_par`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`medicament_id`) REFERENCES `medicaments` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
