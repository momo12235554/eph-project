<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Models\Medicament;
use App\Models\Alerte;
use App\Models\Commande;
use App\Observers\GlobalActionObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enregistrer l'audit d'historique automatique
        Medicament::observe(GlobalActionObserver::class);
        Alerte::observe(GlobalActionObserver::class);
        Commande::observe(GlobalActionObserver::class);
    }
}

