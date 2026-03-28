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
}
