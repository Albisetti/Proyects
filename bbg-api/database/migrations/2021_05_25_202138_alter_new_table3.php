<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterNewTable3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('programs', function (Blueprint $table) {

            if(!Schema::hasColumn('programs','global_bbg_rebate_type')) {
                $table->enum('global_bbg_rebate_type', ['Same', 'Different'])->default('Different')->after('product_minimum_unit_requirement');
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
        Schema::table('programs', function (Blueprint $table) {

            if(Schema::hasColumn('programs','global_bbg_rebate_type')) {
                $table->dropColumn('global_bbg_rebate_type');
            }
        });
    }
}
