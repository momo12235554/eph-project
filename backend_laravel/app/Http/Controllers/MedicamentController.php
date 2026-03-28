<?php

namespace App\Http\Controllers;

use App\Models\Medicament;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class MedicamentController extends Controller
{
    use ApiResponse;

    public function index()
    {
        // Optimisation N+1 : On charge les alertes avec le médicament
        return $this->successResponse(Medicament::with('alertes')->orderBy('nom')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom'      => 'required|string|max:200',
            'lot'      => 'required|string|max:100',
            'quantite' => 'required|integer|min:0',
            'prix'     => 'nullable|numeric|min:0',
            'code'     => 'nullable|string|max:50',
            'categorie' => 'nullable|string|max:100',
            'date_expiration' => 'nullable|date',
        ]);

        $medicament = Medicament::create($validated);
        return $this->successResponse($medicament, 'Médicament ajouté au stock', 201);
    }

    public function show(Medicament $medicament)
    {
        return $this->successResponse($medicament);
    }

    public function update(Request $request, Medicament $medicament)
    {
        $medicament->update($request->all());
        return $this->successResponse($medicament, 'Mise à jour effectuée');
    }

    public function destroy(Medicament $medicament)
    {
        $medicament->delete();
        return $this->successResponse(null, 'Médicament supprimé');
    }

    public function stockFaible()
    {
        $lowStock = Medicament::where('quantite', '<=', 10)->orderBy('quantite')->get();
        return $this->successResponse($lowStock);
    }

    public function expirationProche()
    {
        $expiringSoon = Medicament::whereNotNull('date_expiration')
            ->whereDate('date_expiration', '<=', now()->addDays(30))
            ->orderBy('date_expiration')
            ->get();
        return $this->successResponse($expiringSoon);
    }
}

