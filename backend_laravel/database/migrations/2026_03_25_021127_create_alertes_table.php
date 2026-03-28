<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alertes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('medicament_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('type', 50); // stock_bas, expiration_proche, etc.
            $table->string('titre', 150);
            $table->text('message');
            $table->string('priorite', 20)->default('normale'); // basse, normale, haute
            $table->string('statut', 20)->default('active'); // active, résolue
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('alertes');
    }
};
