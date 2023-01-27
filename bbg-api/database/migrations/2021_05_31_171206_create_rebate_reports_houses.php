<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRebateReportsHouses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rebateReports_houses', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rebateReport_id')->nullable()->constrained('rebateReports')->nullOnDelete();
            $table->foreignId('house_id')->nullable()->constrained('houses')->nullOnDelete();

            $table->date('confirmed_occupancy')->nullable();

            $table->foreignId('installer_pointer_id')->nullable()->constrained('organizations'); //TODO: Unsure on how to handle the delete, shouldn't happen, archive everything?
            $table->foreignId('installer_company_id')->nullable()->constrained('organizations'); //TODO: Unsure on how to handle the delete, shouldn't happen, archive everything?
            $table->foreignId('subcontractor_provider_id')->nullable()->constrained('sub_contractors'); //TODO: Unsure on how to handle the delete, shouldn't happen, archive everything?

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
        Schema::dropIfExists('rebateReports_houses');
    }
}
