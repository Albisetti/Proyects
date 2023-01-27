<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRebateReportsHouses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('rebateReports_houses', function (Blueprint $table) {

            if (Schema::hasColumn('rebateReports_houses', 'confirmed_occupancy')) {
                $table->dropColumn('confirmed_occupancy');
            }

            if (!Schema::hasColumn('rebateReports_houses', 'status')) {
                $table->enum('status', ['action required', 'rebate ready', 'completed'])->nullable(true)->default('action required')->after('id');
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
        Schema::table('rebateReports_houses', function (Blueprint $table) {

            if (!Schema::hasColumn('rebateReports_houses', 'confirmed_occupancy')) {
                $table->date('confirmed_occupancy')->nullable();
            }

            if (Schema::hasColumn('rebateReports_houses', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
}
