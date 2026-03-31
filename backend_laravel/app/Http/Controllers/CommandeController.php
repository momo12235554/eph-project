<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\LigneCommande;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommandeController extends Controller
{
    use ApiResponse;

    public function index()
    {
        return $this->successResponse(
            Commande::with(['fournisseur', 'ligneCommandes.medicament'])->orderBy('date_commande', 'desc')->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'lignes'         => 'required|array|min:1',
            'lignes.*.medicament_id' => 'required|exists:medicaments,id',
            'lignes.*.quantite'      => 'required|integer|min:1',
            'lignes.*.prix_unitaire' => 'nullable|numeric|min:0',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $commande = Commande::create([
                    'fournisseur_id' => $request->fournisseur_id,
                    'user_id'        => $request->user()?->id,
                    'statut'         => 'en_attente',
                    'montant_total'  => 0,
                    'date_commande'  => now(),
                ]);

                $montantTotal = 0;
                foreach ($request->lignes as $ligne) {
                    $ligneCommande = LigneCommande::create([
                        'commande_id'   => $commande->id,
                        'medicament_id' => $ligne['medicament_id'],
                        'quantite'      => $ligne['quantite'],
                        'prix_unitaire' => $ligne['prix_unitaire'] ?? 0,
                    ]);
                    $montantTotal += $ligneCommande->quantite * $ligneCommande->prix_unitaire;
                }

                $commande->update(['montant_total' => $montantTotal]);
                $commande->load(['fournisseur', 'ligneCommandes.medicament']);

                // Envoyer l'email au fournisseur si son adresse est renseignée
                if ($commande->fournisseur && $commande->fournisseur->email) {
                    try {
                        \Illuminate\Support\Facades\Mail::to($commande->fournisseur->email)
                            ->send(new \App\Mail\CommandeFournisseurMail($commande));
                    } catch (\Exception $e) {
                         \Illuminate\Support\Facades\Log::error("Erreur d'envoi mail fournisseur: " . $e->getMessage());
                    }
                }

                return $this->successResponse(
                    $commande,
                    'Commande créée avec succès',
                    201
                );
            });
        } catch (\Exception $e) {
            return $this->errorResponse('Échec de la commande : ' . $e->getMessage(), 500);
        }
    }

    public function show(Commande $commande)
    {
        return $this->successResponse($commande->load(['fournisseur', 'ligneCommandes.medicament', 'livraison']));
    }

    public function update(Request $request, Commande $commande)
    {
        // Si on valide la réception d'une livraison ou qu'on annule avec motif
        if (($request->statut === 'livree' && $commande->statut !== 'livree') || 
            ($request->statut === 'annulee' && $commande->statut !== 'annulee')) {
            
            try {
                return DB::transaction(function () use ($request, $commande) {
                    $commande->update([
                        'statut'      => $request->statut,
                        'commentaire' => $request->commentaire ?? ($request->statut === 'livree' ? 'Réception validée' : 'Annulation sans motif spécifié'),
                    ]);

                    // Mettre à jour les stocks pour chaque ligne uniquement si livrée
                    if ($request->statut === 'livree') {
                        foreach ($commande->ligneCommandes as $ligne) {
                            $medicament = $ligne->medicament;
                            if ($medicament) {
                                $medicament->increment('quantite', $ligne->quantite);
                            }
                        }
                    }

                    $commande->load(['fournisseur']);

                    // Alerter l'admin par email (on utilise le mail de la plateforme configuré)
                    try {
                        \Illuminate\Support\Facades\Mail::to(config('mail.from.address', 'admin@eph.com'))
                            ->send(new \App\Mail\CommandeStatutMail($commande));
                    } catch (\Exception $e) {
                        \Illuminate\Support\Facades\Log::error("Erreur d'envoi mail statut: " . $e->getMessage());
                    }

                    $msg = $request->statut === 'livree' ? 'Livraison validée et stocks mis à jour' : 'Commande annulée avec succès';
                    return $this->successResponse($commande, $msg);
                });
            } catch (\Exception $e) {
                return $this->errorResponse('Échec de la mise à jour : ' . $e->getMessage(), 500);
            }
        }

        $commande->update($request->only(['statut', 'montant_total', 'commentaire']));
        return $this->successResponse($commande, 'Commande mise à jour');
    }

    public function destroy(Commande $commande)
    {
        $commande->delete();
        return $this->successResponse(null, 'Commande supprimée');
    }
}

