<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MedicamentController;
use App\Http\Controllers\AlerteController;
use App\Http\Controllers\OrdonnanceController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| Routes publiques (sans token)
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Routes protégées (token Sanctum requis)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Admin & Pharmacien peuvent manipuler les médicaments, ordonnances, et alertes
    Route::middleware('role:admin,pharmacien')->group(function () {
        Route::apiResource('medicaments', MedicamentController::class);
        Route::get('/medicaments-stock-faible', [MedicamentController::class, 'stockFaible']);
        Route::get('/medicaments-expiration-proche', [MedicamentController::class, 'expirationProche']);
        
        Route::apiResource('alertes', AlerteController::class);
        Route::patch('/alertes/{id}/resoudre', [AlerteController::class, 'resoudre']);
        Route::post('/alertes/generer', [AlerteController::class, 'genererAlertes']);
        
        Route::apiResource('ordonnances', OrdonnanceController::class);
        
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::post('/notifications', [NotificationController::class, 'store']);
        Route::patch('/notifications/{id}/lire', [NotificationController::class, 'marquerLue']);
        Route::patch('/notifications/lire-tout', [NotificationController::class, 'marquerToutesLues']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
        Route::get('/historique', [\App\Http\Controllers\HistoriqueController::class, 'index']);
        Route::post('/historique', [\App\Http\Controllers\HistoriqueController::class, 'store']);
        Route::get('/stats', [\App\Http\Controllers\StatsController::class, 'index']);
    });

    // Admin uniquement pour la gestion des users
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', \App\Http\Controllers\UserController::class);
    });

    // Routes partagées Admin et Fournisseur (pour voir et traiter les commandes)
    Route::middleware('role:admin,fournisseur')->group(function () {
        Route::apiResource('fournisseurs', FournisseurController::class);
        Route::apiResource('commandes', CommandeController::class);
        
        Route::get('/export/stock', [\App\Http\Controllers\ExportController::class, 'stock']);
        Route::get('/export/historique', [\App\Http\Controllers\ExportController::class, 'historique']);
    });
});

