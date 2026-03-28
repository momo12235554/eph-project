<?php

namespace App\Http\Controllers;

use App\Models\Alerte;
use Illuminate\Http\Request;

class AlerteController extends Controller
{
    public function index()
    {
        return response()->json(
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

        return response()->json($alerte, 201);
    }

    public function show($id)
    {
        return response()->json(Alerte::with('medicament')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $alerte = Alerte::findOrFail($id);
        $alerte->update($request->all());
        return response()->json($alerte);
    }

    public function destroy($id)
    {
        Alerte::findOrFail($id)->delete();
        return response()->json(['message' => 'Alerte supprimée.']);
    }

    /**
     * Résoudre une alerte
     */
    public function resoudre($id)
    {
        $alerte = Alerte::findOrFail($id);
        $alerte->update(['statut' => 'resolue', 'resolved_at' => now()]);
        return response()->json($alerte);
    }
}
