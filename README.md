# 🏥 EPH — Application de Gestion d'Établissement Public Hospitalier

Application mobile de gestion hospitalière développée dans le cadre d'un projet académique (COO). Elle permet la gestion des médicaments, des ordonnances, des commandes, des alertes et des utilisateurs au sein d'un établissement de santé.

---

## 📱 Technologies utilisées

| Côté | Technologie |
|------|-------------|
| Frontend | React Native + Expo (Expo Router) |
| Backend | Laravel 10 (API REST) |
| Base de données | MySQL |
| Auth | JWT (Laravel Sanctum) |

---

## 🗂️ Structure du projet

```
EPH/
├── app/                    # Routing Expo (file-based routing)
│   ├── (auth)/             # Pages de connexion et inscription
│   ├── (admin)/            # Interface administrateur
│   ├── (pharma)/           # Interface pharmacien
│   ├── (fournisseur)/      # Interface fournisseur
│   └── index.jsx           # Page d'accueil
│
├── src/
│   ├── services/           # Appels API (authService, medicamentService...)
│   ├── components/         # Composants réutilisables
│   ├── hooks/              # Hooks personnalisés
│   ├── config/             # Configuration (URL API...)
│   └── constants/          # Constantes globales
│
├── assets/                 # Images et icônes
├── backend_laravel/        # Backend Laravel (API REST)
│   ├── app/Models/         # Modèles (Medicament, Ordonnance, Commande...)
│   ├── app/Http/Controllers/ # Contrôleurs API
│   ├── routes/api.php      # Routes API
│   └── database/migrations/# Migrations MySQL
│
└── eph_db.sql              # Dump de la base de données MySQL
```

---

## 👥 Rôles utilisateurs

- **Administrateur** : gestion globale (médicaments, stocks, commandes, alertes, utilisateurs)
- **Pharmacien** : gestion des ordonnances et des stocks
- **Fournisseur** : consultation et traitement des commandes

---

## ⚙️ Installation

### Prérequis
- Node.js + npm
- PHP 8.1+ / Composer
- MySQL
- Expo Go (pour tester sur mobile)

### 1. Frontend React Native

```bash
npm install
npx expo start
```

### 2. Backend Laravel

```bash
cd backend_laravel
composer install
cp .env.example .env
php artisan key:generate
```

Configurer la base de données dans `.env` :
```env
DB_DATABASE=eph_db
DB_USERNAME=root
DB_PASSWORD=
```

Importer la base de données :
```bash
mysql -u root -p eph_db < ../eph_db.sql
```

Lancer le serveur :
```bash
php artisan serve
```

---

## 🚀 Fonctionnalités principales

- ✅ Authentification multi-rôles (Admin / Pharmacien / Fournisseur)
- ✅ Gestion des médicaments et stocks
- ✅ Gestion des ordonnances
- ✅ Système de commandes et livraisons
- ✅ Alertes de stock critique
- ✅ Tableau de bord avec statistiques

---

## 📄 Licence

Projet académique — Université / COO
