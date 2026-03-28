<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alerte extends Model
{
    protected $table = 'alertes';
    public $timestamps = true;


    protected $fillable = [
        'type', 'medicament_id', 'titre', 'message', 'priorite', 'statut', 'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function medicament()
    {
        return $this->belongsTo(Medicament::class);
    }
}
