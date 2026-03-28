<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ordonnances', function (Blueprint $table) {
            $table->id();
            $table->string('numero_ordonnance')->unique();
            $table->string('patient_nom');
            $table->string('patient_prenom');
            $table->string('medecin_nom');
            $table->date('date_prescription');
            $table->string('statut')->default('en_attente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ordonnances');
    }
};
