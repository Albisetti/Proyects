<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProgramsParticipants extends Migration
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
            if(!Schema::hasColumn('programs_participants','overwrite_amount_type')) {
                $table->enum('overwrite_amount_type', ['percentage', 'amount', 'tier'])->nullable()->after('organization_id');
            }

            if(!Schema::hasColumn('programs_participants','residential_rebate_overwrite')) {
                $table->double('residential_rebate_overwrite')->nullable()->after('overwrite_amount_type');
            }

            if(!Schema::hasColumn('programs_participants','multi_unit_rebate_overwrite')) {
                $table->double('multi_unit_rebate_overwrite')->nullable()->after('residential_rebate_overwrite');
            }

            if(!Schema::hasColumn('programs_participants','commercial_rebate_overwrite')) {
                $table->double('commercial_rebate_overwrite')->nullable()->after('multi_unit_rebate_overwrite');
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
            if(Schema::hasColumn('programs_participants','overwrite_amount_type')) {
                $table->dropColumn('overwrite_amount_type');
            }

            if(Schema::hasColumn('programs_participants','residential_rebate_overwrite')) {
                $table->dropColumn('residential_rebate_overwrite');
            }

            if(Schema::hasColumn('programs_participants','multi_unit_rebate_overwrite')) {
                $table->dropColumn('multi_unit_rebate_overwrite');
            }

            if(Schema::hasColumn('programs_participants','commercial_rebate_overwrite')) {
                $table->dropColumn('commercial_rebate_overwrite');
            }
        });
    }
}
