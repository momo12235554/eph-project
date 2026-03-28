<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            Notification::with('medicament')
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'type'    => 'nullable|string|max:50',
            'medicament_id' => 'nullable|exists:medicaments,id',
        ]);

        $notification = Notification::create([
            'user_id'       => $request->user()->id,
            'medicament_id' => $request->medicament_id,
            'message'       => $request->message,
            'type'          => $request->type ?? 'signalement',
            'lu'            => false,
        ]);

        return response()->json($notification, 201);
    }

    /**
     * Marquer une notification comme lue
     */
    public function marquerLue($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['lu' => true]);
        return response()->json($notification);
    }

    /**
     * Marquer toutes les notifications de l'utilisateur comme lues
     */
    public function marquerToutesLues(Request $request)
    {
        Notification::where('user_id', $request->user()->id)->update(['lu' => true]);
        return response()->json(['message' => 'Toutes les notifications ont été marquées comme lues.']);
    }

    public function destroy($id)
    {
        Notification::findOrFail($id)->delete();
        return response()->json(['message' => 'Notification supprimée.']);
    }
}
