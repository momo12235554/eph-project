<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicaments', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 200);
            $table->string('code', 50)->nullable();
            $table->string('code_barre', 100)->nullable();
            $table->string('lot', 100);
            $table->decimal('prix', 10, 2)->default(0);
            $table->integer('quantite')->default(0);
            $table->date('date_expiration')->nullable();
            $table->string('categorie', 100)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicaments');
    }
};
