<x-mail::message>
# Bonjour,

Le statut de la commande **CMD-{{ $commande->id }}** adressée au fournisseur **{{ optional($commande->fournisseur)->nom ?? 'Inconnu' }}** vient d'être mis à jour.

Nouveau Statut : **{{ $statut }}**  
Date de mise à jour : {{ now()->format('d/m/Y H:i') }}

@if($motif)
<x-mail::panel>
@if($commande->statut === 'annulee')
**Motif de l'annulation du fournisseur :**  
@else
**Commentaire de réception :**  
@endif
{{ $motif }}
</x-mail::panel>
@endif

<x-mail::button :url="config('app.frontend_url', 'http://localhost:8081') . '/commandes'">
Voir la commande sur EPH
</x-mail::button>

Cordialement,<br>
L'équipe {{ config('app.name') }}
</x-mail::message>
