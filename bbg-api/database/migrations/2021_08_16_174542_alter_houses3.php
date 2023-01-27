<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterHouses3 extends Migration
{
    public function up()
    {
        //
        Schema::table('houses', function (Blueprint $table) {
            if(!Schema::hasColumn('houses','deleted_at')) {
                $table->softDeletes()->comment('Use to delete record');
            }
            if(!Schema::hasColumn('houses','delete_by')) {
                $table->bigInteger('delete_by')->nullable();
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
        Schema::table('houses', function (Blueprint $table) {
            if(Schema::hasColumn('houses','deleted_at')) {
                $table->dropColumn('deleted_at');
            }
            if(Schema::hasColumn('houses','delete_by')) {
                $table->dropColumn('delete_by');
            }
        });
    }
}
