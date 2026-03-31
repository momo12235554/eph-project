<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medicament extends Model
{
    protected $table = 'medicaments';
    public $timestamps = true;

    protected $fillable = [
        'nom', 'code', 'code_barre', 'lot',
        'prix', 'quantite', 'date_expiration', 'categorie',
    ];

    protected $casts = [
        'date_expiration' => 'date',
        'prix' => 'decimal:2',
    ];

    public function alertes()
    {
        return $this->hasMany(Alerte::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function ligneCommandes()
    {
        return $this->hasMany(LigneCommande::class);
    }

    /**
     * Alertes automatiques intelligentes :
     * - Rupture de stock (quantité = 0) → priorité critique
     * - Stock bas (quantité <= 10)      → priorité haute
     * - Expiration dans 30 jours        → priorité moyenne
     * - Expiration dans 7 jours         → priorité haute
     *
     * Résolution automatique quand le stock remonte.
     */
    protected static function booted()
    {
        static::saved(function ($medicament) {
            // ── Rupture totale ──
            if ($medicament->quantite <= 0) {
                Alerte::updateOrCreate([
                    'medicament_id' => $medicament->id,
                    'type' => 'rupture',
                    'statut' => 'active',
                ], [
                    'titre' => 'Rupture de stock : ' . $medicament->nom,
                    'message' => 'Le stock de ce médicament est épuisé (0 unités). Commande urgente recommandée.',
                    'priorite' => 'critique'
                ]);
            }
            // ── Stock bas (1 – 10) ──
            elseif ($medicament->quantite <= 10) {
                // Résoudre d'abord toute alerte rupture si le stock est remonté > 0
                Alerte::where('medicament_id', $medicament->id)
                    ->where('type', 'rupture')
                    ->where('statut', 'active')
                    ->update(['statut' => 'resolue', 'resolved_at' => now()]);

                Alerte::updateOrCreate([
                    'medicament_id' => $medicament->id,
                    'type' => 'stock_bas',
                    'statut' => 'active',
                ], [
                    'titre' => 'Stock critique : ' . $medicament->nom,
                    'message' => 'La quantité de ce médicament est de ' . $medicament->quantite . '. Veuillez réapprovisionner.',
                    'priorite' => 'haute'
                ]);
            } else {
                // Stock suffisant → résoudre toutes les alertes stock
                Alerte::where('medicament_id', $medicament->id)
                    ->whereIn('type', ['stock_bas', 'rupture'])
                    ->where('statut', 'active')
                    ->update(['statut' => 'resolue', 'resolved_at' => now()]);
            }

            // ── Expiration ──
            if ($medicament->date_expiration) {
                $now = now()->startOfDay();
                $exp = \Carbon\Carbon::parse($medicament->date_expiration)->startOfDay();
                $joursRestants = (int) $now->diffInDays($exp, false);

                if ($joursRestants <= 90 && $joursRestants >= 0) {
                    if ($joursRestants == 0) {
                        $priorite = 'critique';
                        $titre = 'Expiration imminente : ' . $medicament->nom;
                    } else if ($joursRestants <= 30) {
                        $priorite = 'haute';
                        $titre = 'Expiration imminente : ' . $medicament->nom;
                    } else {
                        $priorite = 'moyenne';
                        $titre = 'Expiration proche : ' . $medicament->nom;
                    }
                    
                    Alerte::updateOrCreate([
                        'medicament_id' => $medicament->id,
                        'type' => 'expiration',
                        'statut' => 'active',
                    ], [
                        'titre' => $titre,
                        'message' => 'Expire dans ' . $joursRestants . ' jour(s) (Le ' . $exp->format('d/m/Y') . ').',
                        'priorite' => $priorite
                    ]);
                } elseif ($joursRestants < 0) {
                    Alerte::updateOrCreate([
                        'medicament_id' => $medicament->id,
                        'type' => 'expiration',
                        'statut' => 'active',
                    ], [
                        'titre' => 'Médicament expiré : ' . $medicament->nom,
                        'message' => 'Ce médicament a expiré le ' . $exp->format('d/m/Y') . '. À retirer du stock urgemment !',
                        'priorite' => 'critique'
                    ]);
                } else {
                    // Si plus de 90 jours, on clôture les alertes existantes
                    Alerte::where('medicament_id', $medicament->id)
                        ->where('type', 'expiration')
                        ->where('statut', 'active')
                        ->update(['statut' => 'resolue', 'resolved_at' => now()]);
                }
            }
        });
    }
}
