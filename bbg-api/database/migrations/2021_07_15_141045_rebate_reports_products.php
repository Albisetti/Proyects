<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RebateReportsProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('rebateReports_products', function (Blueprint $table) {
            $table->dateTime('date_of_purchase')->nullable()->change();
            $table->dateTime('date_of_installation')->nullable()->change();
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
        Schema::table('rebateReports_products', function (Blueprint $table) {
            $table->date('rebateReports_products')->nullable()->change();
            $table->date('multi_unit_bonus_amount')->nullable()->change();
        });
    }
}
