<?php

namespace Database\Seeders;

use App\Models\Medicament;
use App\Models\Alerte;
use App\Models\User;
use App\Models\Historique;
use App\Models\Fournisseur;
use App\Models\Ordonnance;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyer les tables
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Medicament::truncate();
        Alerte::truncate();
        Fournisseur::truncate();
        Historique::truncate();
        Ordonnance::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 1. Création d'un fournisseur démo
        $f = Fournisseur::create([
            'nom' => 'PharmAlliance Algérie',
            'contact_personne' => 'M. BENAMEUR',
            'email' => 'contact@pharmalliance.dz',
            'telephone' => '021 00 11 22',
            'adresse' => 'Zone Industrielle, Alger'
        ]);

        // 2. Création de 100 Médicaments (Exemples réalistes)
        $categories = ['Antalgique', 'Antibiotique', 'Anti-inflammatoire', 'Antidiabétique', 'Antihypertenseur'];
        $noms = [
            'Paracétamol 500mg', 'Amoxicilline 1g', 'Ibuprofène 400mg', 'Aspirine 100mg', 
            'Doliprane 1000mg', 'Azithromycine 250mg', 'Oméprazole 20mg', 'Metformine 850mg',
            'Atorvastatine 20mg', 'Losartan 50mg', 'Amlodipine 5mg', 'Clopidogrel 75mg',
            'Levothyroxine 100mcg', 'Tramadol 50mg', 'Ciprofloxacine 500mg', 'Prednisolone 20mg'
        ];

        // Médicaments Normaux
        for ($i = 0; $i < 40; $i++) {
            Medicament::create([
                'nom' => $noms[array_rand($noms)] . " (Lot " . ($i+1) . ")",
                'lot' => 'LOT-2024-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'quantite' => rand(50, 200),
                'prix' => rand(200, 1500),
                'date_expiration' => now()->addMonths(rand(6, 24)),
                'categorie' => $categories[array_rand($categories)]
            ]);
        }

        // 3. SCÉNARIOS POUR LA SOUTENANCE (Les "WOW" de la démo)

        // Scénario A : Stock Critique (Affiche l'alerte sur le mobile)
        $crit1 = Medicament::create([
            'nom' => 'Morphine 10mg (Stock Critique)',
            'lot' => 'LOT-URGENT-001',
            'quantite' => 4,
            'prix' => 2500,
            'date_expiration' => now()->addYear(),
            'categorie' => 'Analgésique Opioïde'
        ]);

        Alerte::create([
            'medicament_id' => $crit1->id,
            'type'          => 'stock_bas',
            'titre'         => 'Rupture imminente',
            'message'       => 'Stock critique de Morphine 10mg. Commande immédiate nécessaire.',
            'priorite'      => 'haute',
            'statut'        => 'active'
        ]);

        // Scénario B : Expiration imminente (Affiche l'alerte date)
        Medicament::create([
            'nom' => 'Insuline Glargine (Expire bientôt)',
            'lot' => 'EXP-JUL-24',
            'quantite' => 45,
            'prix' => 3200,
            'date_expiration' => now()->addDays(5), // Expire dans 5 jours !
            'categorie' => 'Antidiabétique'
        ]);

        // 5. Ordonnances de Démo (Nouveau !)
        Ordonnance::create([
            'numero_ordonnance' => 'ORD-2024-001',
            'patient_nom' => 'BENTORKI',
            'patient_prenom' => 'Fatima',
            'medecin_nom' => 'Dr. BENALI',
            'date_prescription' => now()->subDays(2),
            'statut' => 'terminée'
        ]);

        Ordonnance::create([
            'numero_ordonnance' => 'ORD-2024-002',
            'patient_nom' => 'HAMIDI',
            'patient_prenom' => 'Karim',
            'medecin_nom' => 'Dr. INESS',
            'date_prescription' => now()->subDay(),
            'statut' => 'en_attente'
        ]);

        Ordonnance::create([
            'numero_ordonnance' => 'ORD-2024-003',
            'patient_nom' => 'MAHRANE',
            'patient_prenom' => 'Yacine',
            'medecin_nom' => 'Dr. SAID',
            'date_prescription' => now(),
            'statut' => 'en_attente'
        ]);

        $admin = User::where('role', 'admin')->first();
        if ($admin) {
            Historique::create([
              'user_id' => $admin->id,
              'action' => 'création',
              'details' => 'Initialisation de l\'inventaire et des ordonnances.',
              'date_action' => now()->subDays(2)
            ]);
        }
    }
}
