<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterCustomProduct extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('organization_customProducts', function (Blueprint $table) {
            if(!Schema::hasColumn('organization_customProducts','volume_bbg_rebate')){
                $table->float('volume_bbg_rebate')->nullable()->after('commercial_rebate_overwrite');
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
        Schema::table('organization_customProducts', function (Blueprint $table) {
            if(Schema::hasColumn('organization_customProducts','volume_bbg_rebate')){
                $table->dropColumn('volume_bbg_rebate');
            }
        });
    }
}
