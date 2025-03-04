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
        Schema::create('menuitem_merchants', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_profile_merchant');
            $table->string('nama_item');
            $table->string('nama_deskripsi');
            $table->float('harga');
            $table->string('foto');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menuitem_merchants');
    }
};
