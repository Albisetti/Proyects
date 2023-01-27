<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDuesPayment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dues_payment', function (Blueprint $table) {
            $table->id();

            $table->float('amount');
            $table->dateTime('payment_time')->nullable();
            $table->foreignId("due_id")->nullable()->constrained('organization_dues')->cascadeOnDelete();
            $table->foreignId("claim_id")->nullable()->constrained('claims')->cascadeOnDelete(); //A payment can be extracted from a claim of a builder
            $table->enum('status',['open', 'paid']);

            $table->bigInteger("created_by")->nullable();
            $table->bigInteger("updated_by")->nullable();
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dues_payment');
    }
}
