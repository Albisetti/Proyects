<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizations3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('organizations', function (Blueprint $table) {
            if(Schema::hasColumn('organizations','code')){
                $table->string('code', 100)->nullable()->change();
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
        Schema::table('organizations', function (Blueprint $table) {
            if(!Schema::hasColumn('organizations','code')){
                $table->string('code', 100)->change();
            }
        });
    }
}
