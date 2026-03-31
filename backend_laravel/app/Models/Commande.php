<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    protected $table = 'commandes';
    public $timestamps = true;


    protected $fillable = [
        'fournisseur_id', 'statut', 'montant_total', 'date_commande', 'commentaire'
    ];

    protected $casts = [
        'montant_total' => 'decimal:2',
    ];

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function ligneCommandes()
    {
        return $this->hasMany(LigneCommande::class);
    }

    public function livraison()
    {
        return $this->hasOne(Livraison::class);
    }
}
