<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterClaimRebateReport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('claim_rebateReport', function (Blueprint $table) {
            if(Schema::hasColumn('claims','rebate_paid')) {
                $table->renameColumn('rebate_paid','rebate_adjusted');
            }
            if(!Schema::hasColumn('claims','total_allocation')) {
                $table->double('total_allocation')->nullable()->after('builder_allocation');
            }

            if(!Schema::hasColumn('claims','approved_by')) {
                $table->bigInteger('approved_by')->nullable();
            }
            if(!Schema::hasColumn('claims','approved_at')) {
                $table->timestamp('approved_at')->nullable();
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
        Schema::table('claim_rebateReport', function (Blueprint $table) {
            if(Schema::hasColumn('claims','rebate_adjusted')) {
                $table->renameColumn('rebate_adjusted','rebate_paid');
            }
            if(Schema::hasColumn('claims','total_allocation')) {
                $table->dropColumn('total_allocation');
            }

            if(Schema::hasColumn('claims','approved_by')) {
                $table->dropColumn('approved_by');
            }
            if(Schema::hasColumn('claims','approved_at')) {
                $table->dropColumn('approved_at');
            }
        });
    }
}
