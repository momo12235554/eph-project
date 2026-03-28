<?php

namespace App\Http\Controllers;

use App\Models\Historique;
use Illuminate\Http\Request;

class HistoriqueController extends Controller
{
    public function index()
    {
        return response()->json(Historique::with('user')->orderBy('date_action', 'desc')->get());
    }

    public function store(Request $request)
    {
        $historique = Historique::create([
            'user_id' => $request->user()->id,
            'action'  => $request->action,
            'details' => $request->details,
        ]);
        return response()->json($historique, 201);
    }
}
