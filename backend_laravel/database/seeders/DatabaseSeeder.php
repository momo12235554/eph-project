<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Création de l'Administrateur principal
        User::create([
            'nom' => 'MEDI-ADMIN',
            'prenom' => 'Directeur',
            'email' => 'admin@medistock.dz',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // 2. Création de la Pharmacienne principale (Dr. Iness)
        User::create([
            'nom' => 'BENAMEUR',
            'prenom' => 'Iness',
            'email' => 'iness.benameur@chu.dz',
            'password' => Hash::make('iness123'), // Ajusté pour qu'elle puisse se connecter
            'role' => 'pharmacien',
            'service' => 'Pharmacie Centrale'
        ]);

        // 3. Création d'un Fournisseur démo
        User::create([
            'nom' => 'PharmAlliance',
            'prenom' => 'Service Commercial',
            'email' => 'contact@pharmalliance.dz',
            'password' => Hash::make('fourn123'),
            'role' => 'fournisseur',
        ]);

        // 4. Appel du seeder de données (Stock, Ordonnances, etc.)
        $this->call(DemoDataSeeder::class);
    }
}
