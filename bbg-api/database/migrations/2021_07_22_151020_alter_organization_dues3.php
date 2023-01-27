<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizationDues3 extends Migration
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
            $table->float('annual_dues')->nullable()->change();
            $table->float('prorated_amount')->nullable()->change();
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
            $table->integer('annual_dues')->nullable()->change();
            $table->integer('prorated_amount')->nullable()->change();
        });
    }
}
