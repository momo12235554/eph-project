<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'users';

    /**
     * Colonnes de notre table users personnalisée
     */
    protected $fillable = [
        'username', 'password', 'role', 'nom', 'prenom', 'email',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // Relations
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function historiques()
    {
        return $this->hasMany(Historique::class);
    }

    public function livraisons()
    {
        return $this->hasMany(Livraison::class, 'recu_par');
    }
}
