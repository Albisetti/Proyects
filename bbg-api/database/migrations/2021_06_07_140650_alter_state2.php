<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterState2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('states', function (Blueprint $table) {
            $table->string('iso_code'); //TODO: not unique due to mulitple '' entries, to revisit when the seeder is changed
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
        Schema::table('states', function (Blueprint $table) {
            $table->dropColumn('iso_code');
        });
    }
}
