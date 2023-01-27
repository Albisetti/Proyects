<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizations4 extends Migration
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
            if(Schema::hasColumn('organizations','average_sq_footage')){
                $table->dropColumn('average_sq_footage');
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
            if(Schema::hasColumn('organizations','average_sq_footage')){
                $table->unsignedInteger('average_sq_footage')->nullable()->after('program_id');

            }
        });
    }
}
