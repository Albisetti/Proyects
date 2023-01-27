<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSystemMessageReadBy extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('systemMessage', function (Blueprint $table) {
            $table->bigInteger("created_by")->nullable();
            $table->bigInteger("updated_by")->nullable();
            $table->bigInteger("read_by")->nullable();
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
        Schema::table('systemMessage', function (Blueprint $table) {
            $table->dropColumn("created_by");
            $table->dropColumn("updated_by");
            $table->dropColumn("read_by");
        });
    }
}
