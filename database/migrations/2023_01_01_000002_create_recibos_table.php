<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('recibos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('empleado_id')->constrained()->onDelete('cascade');
            $table->decimal('tasa_bcv_aplicada', 10, 2);
            $table->decimal('salario_base_bs', 15, 2);
            $table->decimal('cestaticket_bs', 15, 2);
            $table->decimal('sso_bs', 15, 2);
            $table->decimal('rpe_bs', 15, 2);
            $table->decimal('faov_bs', 15, 2);
            $table->decimal('total_neto_pagar_bs', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recibos');
    }
};