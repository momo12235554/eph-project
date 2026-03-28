<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    protected $table = 'fournisseurs';
    public $timestamps = false;


    protected $fillable = [
        'nom', 'contact_personne', 'email', 'telephone', 'adresse',
    ];

    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }
}
