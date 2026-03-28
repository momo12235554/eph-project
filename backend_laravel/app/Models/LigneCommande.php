<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    protected $table = 'ligne_commandes';

    protected $fillable = [
        'commande_id', 'medicament_id', 'quantite', 'prix_unitaire',
    ];

    protected $casts = [
        'prix_unitaire' => 'decimal:2',
    ];

    public $timestamps = true;

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }
}
