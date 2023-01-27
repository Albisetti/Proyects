<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterHousesProofOfOccupancy extends Migration
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

            if (Schema::hasColumn('houses', 'proof_of_occupancy')) {
                $table->dropColumn('proof_of_occupancy');
            }

            if (!Schema::hasColumn('houses', 'confirmed_occupancy')) {
                $table->date('confirmed_occupancy')->nullable()->after('expected_completion_date');
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

            if (!Schema::hasColumn('houses', 'proof_of_occupancy')) {
                $table->string('proof_of_occupancy', 100)->nullable()->after('expected_completion_date');
            }

            if (Schema::hasColumn('houses', 'confirmed_occupancy')) {
                $table->dropColumn('confirmed_occupancy');
            }
        });
    }
}
