<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Connexion - retourne un token Sanctum
     */
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string', // Reçu du front-end
            'password' => 'required|string',
        ]);

        // On cherche par email car 'username' n'existe pas dans la table
        $identifier = $request->username;
        
        // --- Alias pour la démo (Facilitateur de soutenance) ---
        if ($identifier === 'admin')       $identifier = 'admin@medistock.dz';
        if ($identifier === 'iness')       $identifier = 'iness.benameur@chu.dz';
        if ($identifier === 'fournisseur') $identifier = 'contact@pharmalliance.dz';

        $user = User::where('email', $identifier)->first();

        // Vérification de l'utilisateur et du mot de passe
        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Identifiants incorrects.', 401);
        }

        // Nettoyer les anciens tokens et créer un nouveau
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'token' => $token,
            'user'  => [
                'id'       => $user->id,
                'role'     => $user->role,
                'nom'      => $user->nom,
                'prenom'   => $user->prenom,
                'email'    => $user->email,
            ]
        ], 'Connexion réussie');
    }

    /**
     * Déconnexion
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->successResponse(null, 'Déconnecté avec succès');
    }

    /**
     * Infos utilisateur
     */
    public function me(Request $request)
    {
        return $this->successResponse($request->user());
    }
}

