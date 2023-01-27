<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVolumeClaimsBuilders extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('volumeClaims_builders', function (Blueprint $table) {
            $table->id();
            $table->foreignId("builder_id")->nullable()->constrained('organizations');
            $table->foreignId("volumeClaim_id")->nullable()->constrained('claims');

            $table->float('rebate_earned')->nullable();
            $table->float('rebate_adjusted')->nullable();
            $table->float('builder_allocation')->nullable();
            $table->double('total_allocation')->nullable();
            $table->string('note')->nullable();

            $table->bigInteger("created_by")->nullable();
            $table->bigInteger("updated_by")->nullable();
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->bigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('volumeClaims_builders');
    }
}
