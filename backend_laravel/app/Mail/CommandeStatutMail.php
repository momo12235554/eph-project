<?php

namespace App\Mail;

use App\Models\Commande;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CommandeStatutMail extends Mailable
{
    use Queueable, SerializesModels;

    public $commande;
    public $statut;
    public $motif;

    public function __construct(Commande $commande)
    {
        $this->commande = $commande;
        $this->statut = $commande->statut === 'livree' ? 'Livrée' : 'Annulée';
        $this->motif = $commande->commentaire;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Mise à jour Commande EPH - Réf: CMD-' . $this->commande->id,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.commandes.statut',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
