<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterDisputes2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('disputes', function (Blueprint $table) {
            if(Schema::hasColumn('disputes','new_rebate_paid')) {
                $table->renameColumn('new_rebate_paid','new_rebate_adjusted');
            }
            if(!Schema::hasColumn('disputes','new_total_allocation')) {
                $table->double('new_total_allocation')->nullable()->after('new_builder_allocation');
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
        Schema::table('disputes', function (Blueprint $table) {
            if(Schema::hasColumn('disputes','new_rebate_adjusted')) {
                $table->renameColumn('new_rebate_adjusted','new_rebate_paid');
            }
            if(!Schema::hasColumn('disputes','new_total_allocation')) {
                $table->dropColumn('new_total_allocation');
            }
        });
    }
}
