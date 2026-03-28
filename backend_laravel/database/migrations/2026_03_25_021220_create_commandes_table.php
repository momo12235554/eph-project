<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fournisseur_id')->constrained()->onDelete('cascade');
            $table->string('statut', 50)->default('en_attente'); // en_attente, envoyee, livree, annulee
            $table->decimal('montant_total', 15, 2)->default(0);
            $table->timestamp('date_commande')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
