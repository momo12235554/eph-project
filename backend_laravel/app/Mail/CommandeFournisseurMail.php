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

class CommandeFournisseurMail extends Mailable
{
    use Queueable, SerializesModels;

    public $commande;

    public function __construct(Commande $commande)
    {
        $this->commande = $commande;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouvelle Commande EPH - Réf: CMD-' . $this->commande->id,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.commandes.fournisseur',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
