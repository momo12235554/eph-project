<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use Illuminate\Http\Request;

class FournisseurController extends Controller
{
    public function index()
    {
        return response()->json(Fournisseur::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'   => 'required|string|max:150',
            'email' => 'nullable|email|max:150',
            'telephone' => 'nullable|string|max:20',
        ]);

        $fournisseur = Fournisseur::create($request->all());
        return response()->json($fournisseur, 201);
    }

    public function show($id)
    {
        return response()->json(Fournisseur::with('commandes')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $fournisseur = Fournisseur::findOrFail($id);
        $fournisseur->update($request->all());
        return response()->json($fournisseur);
    }

    public function destroy($id)
    {
        Fournisseur::findOrFail($id)->delete();
        return response()->json(['message' => 'Fournisseur supprimé.']);
    }
}
