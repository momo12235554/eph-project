<?php

namespace App\Http\Controllers;

use App\Models\Ordonnance;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class OrdonnanceController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(Ordonnance::orderBy('date_prescription', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero_ordonnance' => 'required|string|max:100',
            'patient_nom'       => 'required|string|max:200',
            'patient_prenom'    => 'nullable|string|max:200',
            'medecin_nom'       => 'required|string|max:200',
            'date_prescription' => 'required|date',
            'statut'            => 'nullable|string',
            'lignes'            => 'nullable|array'
        ]);

        if (isset($validated['lignes'])) {
            $validated['medicaments'] = $validated['lignes'];
            unset($validated['lignes']);
        }

        $ordonnance = Ordonnance::create($validated);
        return $this->successResponse($ordonnance, 'Ordonnance ajoutée', 201);
    }

    public function show(Ordonnance $ordonnance)
    {
        return $this->successResponse($ordonnance);
    }

    public function update(Request $request, $id)
    {
        $ordonnance = Ordonnance::findOrFail($id);
        $oldStatut = $ordonnance->statut;
        $newStatut = $request->statut;

        $ordonnance->update($request->all());

        // Décrémenter le stock si l'ordonnance passe à 'delivree'
        if ($newStatut === 'delivree' && $oldStatut !== 'delivree') {
            $lignes = $ordonnance->medicaments ?: [];
            foreach ($lignes as $ligne) {
                if (isset($ligne['medicament_id']) && isset($ligne['quantite'])) {
                    $med = \App\Models\Medicament::find($ligne['medicament_id']);
                    if ($med) {
                        $med->decrement('quantite', (int)$ligne['quantite']);
                        // L'événement static::saved dans Medicament.php s'occupera des alertes
                    }
                }
            }
        }

        return $this->successResponse($ordonnance, 'Ordonnance mise à jour');
    }

    public function destroy($id)
    {
        $ordonnance = Ordonnance::findOrFail($id);
        $ordonnance->delete();
        return $this->successResponse(null, 'Ordonnance supprimée');
    }
}
