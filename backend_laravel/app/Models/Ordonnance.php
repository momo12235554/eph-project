<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ordonnance extends Model
{
    protected $table = 'ordonnances';
    public $timestamps = true;

    protected $fillable = [
        'numero_ordonnance',
        'patient_nom',
        'patient_prenom',
        'medecin_nom',
        'date_prescription',
        'statut',
        'medicaments'
    ];

    protected $casts = [
        'date_prescription' => 'date',
        'medicaments' => 'array',
    ];
}
