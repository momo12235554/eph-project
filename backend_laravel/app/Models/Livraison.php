<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Livraison extends Model
{
    protected $table = 'livraisons';

    protected $fillable = [
        'commande_id', 'recu_par', 'commentaire',
    ];

    public $timestamps = false;

    protected $casts = [
        'date_reception' => 'datetime',
    ];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function receptionnaire()
    {
        return $this->belongsTo(User::class, 'recu_par');
    }
}
