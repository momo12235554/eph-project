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

    // Médicaments
    Route::apiResource('medicaments', MedicamentController::class);
    Route::get('/medicaments-stock-faible', [MedicamentController::class, 'stockFaible']);
    Route::get('/medicaments-expiration-proche', [MedicamentController::class, 'expirationProche']);

    // Alertes
    Route::apiResource('alertes', AlerteController::class);
    Route::patch('/alertes/{id}/resoudre', [AlerteController::class, 'resoudre']);

    // Ordonnances
    Route::apiResource('ordonnances', OrdonnanceController::class);

    // Fournisseurs
    Route::apiResource('fournisseurs', FournisseurController::class);

    // Commandes
    Route::apiResource('commandes', CommandeController::class);

    // Usagers / Gestion
    Route::apiResource('users', \App\Http\Controllers\UserController::class);
    Route::get('/historique', [\App\Http\Controllers\HistoriqueController::class, 'index']);
    Route::post('/historique', [\App\Http\Controllers\HistoriqueController::class, 'store']);
    Route::get('/stats', [\App\Http\Controllers\StatsController::class, 'index']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);

    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::patch('/notifications/{id}/lire', [NotificationController::class, 'marquerLue']);
    Route::patch('/notifications/lire-tout', [NotificationController::class, 'marquerToutesLues']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // Exports & Rapports professionnels
    Route::get('/export/stock', [\App\Http\Controllers\ExportController::class, 'stock']);
    Route::get('/export/historique', [\App\Http\Controllers\ExportController::class, 'historique']);
});

