<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Historique extends Model
{
    protected $table = 'historique';
    public $timestamps = false;


    protected $fillable = [
        'user_id', 'action', 'details',
    ];

    // La table utilise 'date_action' au lieu de 'created_at/updated_at'
    protected $casts = [

        'date_action' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
