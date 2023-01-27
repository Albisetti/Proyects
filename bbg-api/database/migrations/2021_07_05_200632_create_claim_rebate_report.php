<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClaimRebateReport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('claim_rebateReport', function (Blueprint $table) {
            $table->id();

            $table->foreignId("rebateReport_id")->nullable()->constrained('rebateReports');
            $table->foreignId("claim_id")->nullable()->constrained('claims');

            $table->float('rebate_earned')->nullable();
            $table->float('rebate_paid')->nullable();
            $table->float('builder_allocation')->nullable();
            $table->string('note')->nullable();

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
        Schema::dropIfExists('claim_rebateReport');
    }
}
