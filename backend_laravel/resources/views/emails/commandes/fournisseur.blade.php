<x-mail::message>
# Bonjour {{ optional($commande->fournisseur)->nom ?? 'Cher partenaire' }},

Une nouvelle commande de médicaments vient d'être effectuée auprès de votre entreprise de fourniture.

**Référence :** CMD-{{ $commande->id }}  
**Date :** {{ \Carbon\Carbon::parse($commande->date_commande)->format('d/m/Y à H:i') }}

---

Veuillez trouver ci-dessous le récapitulatif des médicaments commandés :

<x-mail::table>
| Médicament | Quantité | Prix unitaire |
| :--------- | :------: | :------------ |
@foreach($commande->ligneCommandes as $ligne)
| {{ $ligne->medicament->nom ?? 'Produit inconnu' }} | {{ $ligne->quantite }} unités | {{ number_format($ligne->prix_unitaire, 2) }} € |
@endforeach
</x-mail::table>

**Montant total estimé :** {{ number_format($commande->montant_total, 2) }} €

---

<x-mail::panel>
**Action requise :** Veuillez vous connecter à votre compte pour **valider** ou **annuler** cette commande. En cas d'annulation, un motif sera demandé afin d'informer l'administrateur.
</x-mail::panel>

<x-mail::button :url="config('app.url', 'http://localhost:8081')">
Se connecter à mon compte EPH
</x-mail::button>

Cordialement,  
**Service Achat — EPH GRAND CHU DE CORSE**
</x-mail::message>
