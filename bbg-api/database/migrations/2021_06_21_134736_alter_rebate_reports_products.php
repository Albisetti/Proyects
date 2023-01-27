<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRebateReportsProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('rebateReports_products', function (Blueprint $table) {
            if (Schema::hasColumn('rebateReports_products', 'status')) {
                $table->dropColumn('status');
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
        Schema::table('rebateReports_products', function (Blueprint $table) {
            if (!Schema::hasColumn('rebateReports_products', 'status')) {
                $table->enum('status', ['action required', 'rebate ready', 'completed'])->nullable()->after('product_id');
            }
        });
    }
}
