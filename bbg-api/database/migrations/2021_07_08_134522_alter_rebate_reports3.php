<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRebateReports3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('rebateReports_houses', function (Blueprint $table) {
            if(Schema::hasColumn('rebateReports_houses','installer_pointer_id')){
                $table->dropConstrainedForeignId("installer_pointer_id");
            }

            if(Schema::hasColumn('rebateReports_houses','installer_company_id')){
                $table->dropConstrainedForeignId("installer_company_id");
            }

            if(Schema::hasColumn('rebateReports_houses','subcontractor_provider_id')){
                $table->dropConstrainedForeignId("subcontractor_provider_id");
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table('rebateReports_houses', function (Blueprint $table) {
            if(!Schema::hasColumn('rebateReports_houses','installer_pointer_id')){
                $table->foreignId('installer_pointer_id')->nullable()->constrained('organizations'); //TODO: Unsure on how to handle the delete, shouldn't happen, archive everything?
            }

            if(!Schema::hasColumn('rebateReports_houses','installer_company_id')){
                $table->foreignId('installer_company_id')->nullable()->constrained('organizations'); //TODO: Unsure on how to handle the delete, shouldn't happen, archive everything?
            }

            if(!Schema::hasColumn('rebateReports_houses','subcontractor_provider_id')){
                $table->foreignId('subcontractor_provider_id')->nullable()->constrained('sub_contractors'); //TODO: Unsure on how to handle the delete, shouldn't happen, archive everything?
            }
        });
    }
}
