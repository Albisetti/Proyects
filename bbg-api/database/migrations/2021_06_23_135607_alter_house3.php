<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterHouse3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('houses', function (Blueprint $table) {

            if (!Schema::hasColumn('houses', 'subdivision_id')) {
                $table->foreignId('subdivision_id')->nullable()->constrained('sub_divisions')->after('state_id');
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

            if (Schema::hasColumn('houses', 'subdivision_id')) {
                $table->dropConstrainedForeignId('subdivision_id');
            }
        });
    }
}
