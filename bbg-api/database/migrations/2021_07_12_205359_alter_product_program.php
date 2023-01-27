<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProductProgram extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('products_programs', function (Blueprint $table) {
            if(!Schema::hasColumn('products_programs','volume_bbg_rebate')){
                $table->float('volume_bbg_rebate')->nullable()->after('multi_reporting');
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
        Schema::table('programs', function (Blueprint $table) {
            if(Schema::hasColumn('products_programs','volume_bbg_rebate')){
                $table->dropColumn('volume_bbg_rebate');
            }
        });
    }
}
