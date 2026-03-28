<?php

namespace App\Observers;

use App\Models\Historique;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class GlobalActionObserver
{
    /**
     * Enregistre l'action dans l'historique lors de la création d'un modèle
     */
    public function created(Model $model)
    {
        $this->logAction($model, 'création');
    }

    /**
     * Enregistre l'action et vérifie les alertes lors de la modification
     */
    public function updated(Model $model)
    {
        $this->logAction($model, 'modification');

        // Logique spécifique aux médicaments : Alerte automatique si stock bas
        if ($model instanceof \App\Models\Medicament) {
            if ($model->quantite < 20) {
                // Vérifier si une alerte active existe déjà
                reset($model); // Refresh model state
                $exists = \App\Models\Alerte::where('medicament_id', $model->id)
                    ->where('statut', 'active')
                    ->where('type', 'stock_bas')
                    ->exists();

                if (!$exists) {
                    \App\Models\Alerte::create([
                        'medicament_id' => $model->id,
                        'type'          => 'stock_bas',
                        'titre'         => 'Stock Critique',
                        'message'       => "Alerte : Le stock de {$model->nom} est faible ({$model->quantite} restants).",
                        'priorite'      => 'haute',
                        'statut'        => 'active'
                    ]);
                }
            }
        }
    }


    /**
     * Enregistre l'action dans l'historique lors de la suppression d'un modèle
     */
    public function deleted(Model $model)
    {
        $this->logAction($model, 'suppression');
    }

    /**
     * Log l'action dans la table historique
     */
    protected function logAction(Model $model, string $actionType)
    {
        // On ne log pas si l'utilisateur n'est pas connecté
        if (!Auth::check()) return;

        $modelName = class_basename($model);
        $details = "Action '{$actionType}' effectuée sur le modèle '{$modelName}' (ID: {$model->id})";

        Historique::create([
            'user_id'     => Auth::id(),
            'action'      => $actionType,
            'details'     => $details,
            'date_action' => now(),
        ]);
    }
}
