<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterConversionActivityProduct2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('conversionByActivity_products', function (Blueprint $table) {
            $table->double('residential_bonus_amount')->nullable();
            $table->double('multi_unit_bonus_amount')->nullable();
            $table->double('commercial_bonus_amount')->nullable();
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
        Schema::table('conversionByActivity_products', function (Blueprint $table) {
            $table->dropColumn('residential_bonus_amount');
            $table->dropColumn('multi_unit_bonus_amount');
            $table->dropColumn('commercial_bonus_amount');
        });
    }
}
