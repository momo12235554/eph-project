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
                Alerte::firstOrCreate([
                    'medicament_id' => $medicament->id,
                    'type' => 'rupture',
                    'statut' => 'active',
                ], [
                    'titre' => 'Rupture de stock : ' . $medicament->nom,
                    'message' => 'Le stock de ce médicament est épuisé (0 unités). Commande urgente recommandée.',
                    'priorite' => 'haute'
                ]);
            }
            // ── Stock bas (1 – 10) ──
            elseif ($medicament->quantite <= 10) {
                // Résoudre d'abord toute alerte rupture si le stock est remonté > 0
                Alerte::where('medicament_id', $medicament->id)
                    ->where('type', 'rupture')
                    ->where('statut', 'active')
                    ->update(['statut' => 'resolue', 'resolved_at' => now()]);

                Alerte::firstOrCreate([
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
            if ($medicament->date_expiration && $medicament->date_expiration > now()) {
                $joursRestants = $medicament->date_expiration->diffInDays(now());

                if ($joursRestants <= 7) {
                    Alerte::firstOrCreate([
                        'medicament_id' => $medicament->id,
                        'type' => 'expiration',
                        'statut' => 'active',
                    ], [
                        'titre' => 'Expiration imminente : ' . $medicament->nom,
                        'message' => 'Expire dans ' . $joursRestants . ' jours (Le ' . $medicament->date_expiration->format('d/m/Y') . '). Retirer du stock !',
                        'priorite' => 'haute'
                    ]);
                } elseif ($joursRestants <= 30) {
                    Alerte::firstOrCreate([
                        'medicament_id' => $medicament->id,
                        'type' => 'expiration',
                        'statut' => 'active',
                    ], [
                        'titre' => 'Expiration proche : ' . $medicament->nom,
                        'message' => 'Expire dans ' . $joursRestants . ' jours (Le ' . $medicament->date_expiration->format('d/m/Y') . ').',
                        'priorite' => 'moyenne'
                    ]);
                }
            }
        });
    }
}
