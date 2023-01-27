<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProgramsAddParticipantBoolean extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('programs', function (Blueprint $table) {
            if(!Schema::hasColumn('programs','available_specific_member_only')){
                $table->boolean('available_specific_member_only')->default(false)->after('end_date');
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
        Schema::table('programs', function (Blueprint $table) {
            if(Schema::hasColumn('programs','available_specific_member_only')){
                $table->dropColumn('available_specific_member_only');
            }
        });
    }
}
