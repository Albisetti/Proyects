<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterHouses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('houses', function (Blueprint $table) {

            if(Schema::hasColumn('houses','confirmed_occupancy')) {
                $table->dropColumn('confirmed_occupancy');
            }

            if(!Schema::hasColumn('houses','property_type')) {
                $table->enum('property_type', ['residential','multi-unit','commercial'])->default('residential')->after('id');
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
        Schema::table('houses', function (Blueprint $table) {

            if (!Schema::hasColumn('houses', 'confirmed_occupancy')) {
                $table->date('confirmed_occupancy')->nullable()->after('expected_completion_date');
            }

            if(Schema::hasColumn('houses','property_type')) {
                $table->dropColumn('property_type');
            }
        });
    }
}
