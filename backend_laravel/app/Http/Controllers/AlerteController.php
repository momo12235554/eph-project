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
        $count = 0;

        // Stock bas / rupture
        $medicaments = Medicament::all();
        foreach ($medicaments as $med) {
            if ($med->quantite <= 0) {
                $created = Alerte::firstOrCreate([
                    'medicament_id' => $med->id,
                    'type' => 'rupture',
                    'statut' => 'active',
                ], [
                    'titre' => 'Rupture de stock : ' . $med->nom,
                    'message' => 'Stock épuisé (0 unités). Commande urgente recommandée.',
                    'priorite' => 'haute'
                ]);
                if ($created->wasRecentlyCreated) $count++;
            } elseif ($med->quantite <= 10) {
                $created = Alerte::firstOrCreate([
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
            if ($med->date_expiration && Carbon::parse($med->date_expiration)->gt(now())) {
                $jours = Carbon::parse($med->date_expiration)->diffInDays(now());
                if ($jours <= 30) {
                    $created = Alerte::firstOrCreate([
                        'medicament_id' => $med->id,
                        'type' => 'expiration',
                        'statut' => 'active',
                    ], [
                        'titre' => 'Expiration proche : ' . $med->nom,
                        'message' => 'Expire dans ' . $jours . ' jours.',
                        'priorite' => $jours <= 7 ? 'haute' : 'moyenne'
                    ]);
                    if ($created->wasRecentlyCreated) $count++;
                }
            }
        }

        return $this->successResponse(
            ['alertes_generees' => $count],
            $count > 0 ? "$count nouvelle(s) alerte(s) générée(s)." : 'Aucune nouvelle alerte.'
        );
    }
}
