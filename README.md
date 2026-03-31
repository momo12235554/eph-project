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

EPH/
├── app/                         # Frontend Expo / React Native
│   ├── (admin)/                # Interfaces admin
│   │   ├── _layout.tsx
│   │   ├── admin.jsx
│   │   ├── alertes_page.jsx
│   │   ├── gs_medicament.jsx
│   │   ├── gs_ordonnance.jsx
│   │   ├── lance_alertes.jsx
│   │   └── ordonnances_page.jsx
│   │
│   ├── (auth)/                 # Écrans de connexion
│   │   ├── connexion.jsx
│   │   ├── connexion_admin.jsx
│   │   └── connexion_fournisseur.jsx
│   │
│   ├── (fournisseur)/          # Interface fournisseur
│   │   ├── _layout.tsx
│   │   └── fournisseur.jsx
│   │
│   ├── (pharma)/               # Interface pharmacien
│   │   ├── _layout.tsx
│   │   └── sc_phrm.jsx
│   │
│   ├── _layout.tsx             # Layout principal Expo Router
│   ├── index.jsx               # Page d’accueil
│   ├── propos.jsx              # À propos
│   └── +not-found.tsx          # Gestion route inconnue
│
├── assets/                     # Ressources statiques
│   ├── fonts/
│   ├── images/
│   └── liste_medecament.xlsx
│
├── backend_laravel/            # Backend API Laravel
│   ├── app/
│   │   ├── Console/Commands/
│   │   │   └── TestMailCommand.php
│   │   │
│   │   ├── Http/
│   │   │   ├── Controllers/    # Contrôleurs métier/API
│   │   │   │   ├── AlerteController.php
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── CommandeController.php
│   │   │   │   ├── ExportController.php
│   │   │   │   ├── FournisseurController.php
│   │   │   │   ├── HistoriqueController.php
│   │   │   │   ├── MedicamentController.php
│   │   │   │   ├── NotificationController.php
│   │   │   │   ├── OrdonnanceController.php
│   │   │   │   ├── StatsController.php
│   │   │   │   └── UserController.php
│   │   │   │
│   │   │   └── Middleware/
│   │   │       ├── Authenticate.php
│   │   │       └── RoleMiddleware.php
│   │   │
│   │   ├── Mail/               # Envoi d’e-mails
│   │   │   ├── CommandeFournisseurMail.php
│   │   │   └── CommandeStatutMail.php
│   │   │
│   │   ├── Models/             # Modèles Eloquent
│   │   │   ├── Alerte.php
│   │   │   ├── Commande.php
│   │   │   ├── Fournisseur.php
│   │   │   ├── Historique.php
│   │   │   ├── LigneCommande.php
│   │   │   ├── Livraison.php
│   │   │   ├── Medicament.php
│   │   │   ├── Notification.php
│   │   │   ├── Ordonnance.php
│   │   │   └── User.php
│   │   │
│   │   ├── Observers/
│   │   │   └── GlobalActionObserver.php
│   │   │
│   │   ├── Providers/
│   │   │   └── AppServiceProvider.php
│   │   │
│   │   └── Traits/
│   │       └── ApiResponse.php
│   │
│   ├── database/
│   │   ├── factories/
│   │   ├── migrations/         # Structure base de données
│   │   └── seeders/            # Données de démonstration
│   │
│   ├── routes/
│   │   ├── api.php             # Routes API principales
│   │   ├── web.php
│   │   └── console.php
│   │
│   ├── tests/
│   │   ├── Feature/
│   │   ├── Unit/
│   │   └── TestCase.php
│   │
│   ├── config/
│   ├── public/
│   ├── resources/
│   ├── storage/
│   ├── bootstrap/
│   ├── artisan
│   ├── composer.json
│   └── phpunit.xml
│
├── eph_db.sql                  # Export base de données
├── app.json                    # Config Expo
├── metro.config.js
├── expo-env.d.ts
├── build.bat
├── build_log.txt
├── export_log.txt
├── dist/                       # Build/export
├── node_modules/               # Dépendances frontend
└── .git/                       # Historique Git

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
