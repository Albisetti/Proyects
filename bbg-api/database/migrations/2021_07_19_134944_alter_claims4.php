<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterClaims4 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('claims', function (Blueprint $table) {
            if(!Schema::hasColumn('claims','claimPeriod_id')) {
                $table->foreignId('claimPeriod_id')->nullable()->constrained('claimPeriods');
            }
            if(!Schema::hasColumn('claims','deleted_at')) {
                $table->softDeletes()->comment('Use to delete record');
            }
            if(!Schema::hasColumn('claims','deleted_at')) {
                $table->bigInteger('delete_by')->nullable();
            }
            $table->dropColumn('claim_status');
            $table->enum('status', ['open','close'])->default('open');
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
        Schema::table('claims', function (Blueprint $table) {
            $table->dropConstrainedForeignId('claimPeriod_id');
            $table->dropColumn('deleted_at');
            $table->dropColumn('delete_by');
            $table->string('claim_status')->nullable();
            $table->dropColumn('status');
        });
    }
}
