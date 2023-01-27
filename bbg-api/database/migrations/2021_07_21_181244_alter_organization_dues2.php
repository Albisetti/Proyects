<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizationDues2 extends Migration
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
            $table->dropColumn('start_date');
            $table->integer('year')->after('annual_dues');
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
            $table->Date('start_date')->after('annual_dues');
            $table->dropColumn('year');
        });
    }
}
