<?php

namespace App\Http\Controllers;

use App\Models\Medicament;
use Illuminate\Http\Response;

class ExportController extends Controller
{
    /**
     * Exporte l'inventaire actuel en format CSV pour Excel
     */
    public function stock()
    {
        $medicaments = Medicament::orderBy('nom')->get();
        
        $filename = "inventaire_stock_" . date('Y-m-d_H-i') . ".csv";
        
        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use ($medicaments) {
            $file = fopen('php://output', 'w');
            
            // Ajouter le BOM pour l'encodage UTF-8 (pour qu'Excel lise bien les accents comme Paracétamol)
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Entêtes des colonnes
            fputcsv($file, [
                'ID', 'Désignation', 'Code/Lot', 'Catégorie', 'Quantité', 'Prix Unitaire (DA)', 'Valeur Stock (DA)', 'Date Expiraion'
            ], ';');

            foreach ($medicaments as $med) {
                $valeur = $med->quantite * $med->prix;
                fputcsv($file, [
                    $med->id,
                    $med->nom,
                    $med->lot ?: $med->code,
                    $med->categorie ?: 'N/A',
                    $med->quantite,
                    number_format($med->prix, 2, ',', ' '),
                    number_format($valeur, 2, ',', ' '),
                    $med->date_expiration ? $med->date_expiration->format('d/m/Y') : 'N/A'
                ], ';');
            }
            
            fclose($file);
        };

    }

    /**
     * Exporte l'historique des actions en format CSV
     */
    public function historique()
    {
        $historiques = \App\Models\Historique::with('user')->orderBy('date_action', 'desc')->get();
        
        $filename = "historique_actions_" . date('Y-m-d_H-i') . ".csv";
        
        $headers = [
            "Content-type"        => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$filename",
        ];

        $callback = function() use ($historiques) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($file, ['ID', 'Date', 'Utilisateur', 'Action', 'Détails'], ';');

            foreach ($historiques as $h) {
                fputcsv($file, [
                    $h->id,
                    $h->date_action,
                    $h->user ? $h->user->username : 'Système',
                    strtoupper($h->action),
                    $h->details
                ], ';');
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

