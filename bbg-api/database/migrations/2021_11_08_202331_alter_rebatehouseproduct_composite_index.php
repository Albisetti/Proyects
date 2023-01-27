<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRebatehouseproductCompositeIndex extends Migration
{
    public function up()
    {
        Schema::table('rebateReports_houses_products', function (Blueprint $table) {
            $table->unique(['rebateReport_id', 'house_id','product_id'], 'unique-rhp');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('rebateReports_houses_products', function (Blueprint $table) {
            $table->dropUnique('unique-rhp');
        });
    }
}
