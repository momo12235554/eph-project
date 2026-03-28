<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('livraisons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained()->onDelete('cascade');
            $table->foreignId('recu_par')->constrained('users')->onDelete('cascade');
            $table->timestamp('date_reception')->useCurrent();
            $table->text('commentaire')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('livraisons');
    }
};
