<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizationDues extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('organization_dues', function (Blueprint $table) {
            if(Schema::hasColumn('organization_dues','amount')){
                $table->renameColumn('amount', 'annual_dues');
            }
            if(!Schema::hasColumn('organization_dues','prorated_amount')){
                $table->Integer("prorated_amount")->nullable()->after('start_date');
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
        Schema::table('organization_dues', function (Blueprint $table) {
            if(Schema::hasColumn('organization_dues','annual_dues')){
                $table->renameColumn('annual_dues','amount');
            }
            if(Schema::hasColumn('organization_dues','prorated_amount')){
                $table->dropColumn('prorated_amount');
            }
        });
    }
}
