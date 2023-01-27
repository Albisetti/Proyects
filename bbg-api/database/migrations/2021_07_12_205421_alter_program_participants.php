<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProgramParticipants extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('programs_participants', function (Blueprint $table) {
            if(!Schema::hasColumn('programs_participants','volume_bbg_rebate')){
                $table->float('volume_bbg_rebate')->nullable()->after('commercial_rebate_overwrite');
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
        Schema::table('programs_participants', function (Blueprint $table) {
            if(Schema::hasColumn('programs_participants','volume_bbg_rebate')){
                $table->dropColumn('volume_bbg_rebate');
            }
        });
    }
}
