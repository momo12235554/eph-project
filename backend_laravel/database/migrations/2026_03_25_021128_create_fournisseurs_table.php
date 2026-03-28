<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fournisseurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->string('contact_personne', 150)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('telephone', 50)->nullable();
            $table->text('adresse')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fournisseurs');
    }
};
