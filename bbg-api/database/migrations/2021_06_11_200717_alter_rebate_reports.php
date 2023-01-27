<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRebateReports extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('rebateReports', function (Blueprint $table) {
            if(!Schema::hasColumn('rebateReports','status')) {
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
        Schema::table('rebateReports', function (Blueprint $table) {
            if(Schema::hasColumn('rebateReports','status')) {
                $table->dropColumn('status');
            }
        });
    }
}
