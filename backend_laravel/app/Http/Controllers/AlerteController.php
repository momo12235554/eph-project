<?php

namespace App\Http\Controllers;

use App\Models\Alerte;
use App\Models\Medicament;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AlerteController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $this->syncAlertes();

        return $this->successResponse(
            Alerte::with('medicament')->orderBy('created_at', 'desc')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'type'    => 'required|string|max:50',
            'titre'   => 'nullable|string|max:255',
            'message' => 'nullable|string',
            'priorite' => 'nullable|in:basse,moyenne,haute',
            'medicament_id' => 'nullable|exists:medicaments,id',
        ]);

        $alerte = Alerte::create($request->all());

        return $this->successResponse($alerte, 'Alerte créée', 201);
    }

    public function show($id)
    {
        return $this->successResponse(Alerte::with('medicament')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $alerte = Alerte::findOrFail($id);
        $alerte->update($request->all());
        return $this->successResponse($alerte, 'Alerte mise à jour');
    }

    public function destroy($id)
    {
        Alerte::findOrFail($id)->delete();
        return $this->successResponse(null, 'Alerte supprimée.');
    }

    /**
     * Résoudre une alerte
     */
    public function resoudre($id)
    {
        $alerte = Alerte::findOrFail($id);
        $alerte->update(['statut' => 'resolue', 'resolved_at' => now()]);
        return $this->successResponse($alerte, 'Alerte résolue.');
    }

    /**
     * Générer les alertes automatiquement pour tous les médicaments
     * Utile pour un scan périodique ou un bouton "Vérifier le stock"
     */
    public function genererAlertes()
    {
        $count = $this->syncAlertes();

        return $this->successResponse(
            ['alertes_generees' => $count],
            $count > 0 ? "$count nouvelle(s) alerte(s) générée(s) ou mise(s) à jour." : 'Aucune nouvelle alerte.'
        );
    }

    /**
     * Méthode interne pour synchroniser les alertes
     */
    private function syncAlertes()
    {
        $count = 0;

        // Stock bas / rupture
        $medicaments = Medicament::all();
        foreach ($medicaments as $med) {
            if ($med->quantite <= 0) {
                $created = Alerte::updateOrCreate([
                    'medicament_id' => $med->id,
                    'type' => 'rupture',
                    'statut' => 'active',
                ], [
                    'titre' => 'Rupture de stock : ' . $med->nom,
                    'message' => 'Stock épuisé (0 unités). Commande urgente recommandée.',
                    'priorite' => 'critique'
                ]);
                if ($created->wasRecentlyCreated) $count++;
            } elseif ($med->quantite <= 10) {
                $created = Alerte::updateOrCreate([
                    'medicament_id' => $med->id,
                    'type' => 'stock_bas',
                    'statut' => 'active',
                ], [
                    'titre' => 'Stock critique : ' . $med->nom,
                    'message' => 'Quantité restante : ' . $med->quantite . ' unités.',
                    'priorite' => 'haute'
                ]);
                if ($created->wasRecentlyCreated) $count++;
            }

            // Expiration
            if ($med->date_expiration) {
                $now = now()->startOfDay();
                $exp = Carbon::parse($med->date_expiration)->startOfDay();
                $joursRestants = (int) $now->diffInDays($exp, false);

                if ($joursRestants <= 90 && $joursRestants >= 0) {
                    if ($joursRestants == 0) {
                        $priorite = 'critique';
                        $titre = 'Expiration imminente : ' . $med->nom;
                    } else if ($joursRestants <= 30) {
                        $priorite = 'haute';
                        $titre = 'Expiration imminente : ' . $med->nom;
                    } else {
                        $priorite = 'moyenne';
                        $titre = 'Expiration proche : ' . $med->nom;
                    }

                    $created = Alerte::updateOrCreate([
                        'medicament_id' => $med->id,
                        'type' => 'expiration',
                        'statut' => 'active',
                    ], [
                        'titre' => $titre,
                        'message' => 'Expire dans ' . $joursRestants . ' jour(s) (Le ' . $exp->format('d/m/Y') . ').',
                        'priorite' => $priorite
                    ]);
                    if ($created->wasRecentlyCreated) $count++;
                } elseif ($joursRestants < 0) {
                    $created = Alerte::updateOrCreate([
                        'medicament_id' => $med->id,
                        'type' => 'expiration',
                        'statut' => 'active',
                    ], [
                        'titre' => 'Médicament expiré : ' . $med->nom,
                        'message' => 'Ce médicament a expiré le ' . $exp->format('d/m/Y') . '. À retirer du stock urgemment !',
                        'priorite' => 'critique'
                    ]);
                    if ($created->wasRecentlyCreated) $count++;
                }
            }
        }

        return $count;
    }
}
