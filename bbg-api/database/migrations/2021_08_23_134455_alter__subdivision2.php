<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSubdivision2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('sub_divisions', function (Blueprint $table) {

            if(!Schema::hasColumn('sub_divisions','organization_id')) {
                $table->foreignId('organization_id')->constrained('organizations');
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
        Schema::table('sub_divisions', function (Blueprint $table) {

            if(Schema::hasColumn('sub_divisions','organization_id')) {
                $table->dropConstrainedForeignId('organization_id');
            }
        });
    }
}
