<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMailCommand extends Command
{
    protected $signature = 'mail:test {email=lolocargese916@gmail.com}';
    protected $description = 'Envoyer un mail de test pour vérifier la configuration SMTP';

    public function handle()
    {
        $to = $this->argument('email');
        $this->info("Envoi d'un mail de test à : $to ...");

        try {
            Mail::raw(
                "🎉 Félicitations !\n\nLa configuration d'envoi d'e-mails de votre système EPH fonctionne parfaitement.\n\nVous recevrez désormais des notifications automatiques lorsque :\n- Une commande est passée auprès d'un fournisseur\n- Le statut d'une commande est mis à jour (livraison ou annulation)\n\n-- L'équipe EPH",
                function ($msg) use ($to) {
                    $msg->to($to)->subject('✅ Test EPH - Configuration Mail Réussie !');
                }
            );
            $this->info('✅ Mail envoyé avec succès ! Vérifiez votre boîte mail.');
        } catch (\Exception $e) {
            $this->error('❌ Erreur : ' . $e->getMessage());
        }
    }
}
