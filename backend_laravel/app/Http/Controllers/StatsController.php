<?php

namespace App\Http\Controllers;

use App\Models\Medicament;
use App\Models\User;
use App\Models\Commande;
use App\Models\Alerte;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse([
            'medicaments_total'    => Medicament::count(),
            'stock_faible'         => Medicament::where('quantite', '<=', 10)->count(),
            'alertes_actives'      => Alerte::where('statut', 'active')->count(),
            'commandes_en_attente' => Commande::where('statut', 'en_attente')->count(),
            'users_total'          => User::count(),
            'valeur_stock'         => Medicament::sum(DB::raw('quantite * prix')),
        ]);
    }
}

