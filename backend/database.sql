-- Création de la base de données
CREATE DATABASE IF NOT EXISTS eph_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE eph_db;

-- Table des utilisateurs (pharmaciens, admins, fournisseurs)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('pharmacien', 'admin', 'fournisseur') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des médicaments
CREATE TABLE IF NOT EXISTS medicaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    code VARCHAR(50),
    code_barre VARCHAR(100),
    lot VARCHAR(50) NOT NULL,
    prix DECIMAL(10, 2) DEFAULT 0.00,
    quantite INT NOT NULL DEFAULT 0,
    date_expiration DATE NOT NULL,
    categorie VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des ordonnances
CREATE TABLE IF NOT EXISTS ordonnances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_ordonnance VARCHAR(50) UNIQUE NOT NULL,
    patient_nom VARCHAR(100) NOT NULL,
    patient_prenom VARCHAR(100) NOT NULL,
    medecin_nom VARCHAR(100) NOT NULL,
    date_prescription DATE NOT NULL,
    statut ENUM('en_attente', 'validee', 'delivree', 'annulee') DEFAULT 'en_attente',
    pharmacien_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pharmacien_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des lignes d'ordonnances (médicaments prescrits)
CREATE TABLE IF NOT EXISTS ordonnance_lignes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ordonnance_id INT NOT NULL,
    medicament_id INT NOT NULL,
    quantite INT NOT NULL,
    posologie TEXT,
    FOREIGN KEY (ordonnance_id) REFERENCES ordonnances(id) ON DELETE CASCADE,
    FOREIGN KEY (medicament_id) REFERENCES medicaments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table des alertes
CREATE TABLE IF NOT EXISTS alertes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('stock_bas', 'expiration_proche', 'rupture', 'autre') NOT NULL,
    medicament_id INT,
    titre VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    priorite ENUM('basse', 'moyenne', 'haute', 'critique') DEFAULT 'moyenne',
    statut ENUM('active', 'resolue', 'ignoree') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (medicament_id) REFERENCES medicaments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertion d'utilisateurs de test
INSERT INTO users (username, nom, prenom, email, password, role) VALUES
('iness', 'BENAMEUR', 'Iness', 'iness.benameur@chu.dz', 'password', 'pharmacien'),
('sophie', 'MARTIN', 'Sophie', 'sophie.martin@chu.dz', 'password', 'pharmacien'),
('admin', 'ADMIN', 'System', 'admin@chu.dz', 'password', 'admin'),
('fournisseur', 'PharmaCorp', 'Fournisseur', 'contact@pharmacorp.dz', 'password', 'fournisseur');

-- Note: Le mot de passe pour tous les comptes de test est "password"
