<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\FloatType;
use Doctrine\DBAL\Types\Type;

class AlterProgramsParticipantsFlatRebate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        if (!Type::hasType('double')) {
            Type::addType('double', FloatType::class);
        }

        Schema::table('programs_participants', function (Blueprint $table) {
            if (!Schema::hasColumn('programs_participants', 'flat_builder_overwrite')) {
                $table->double('flat_builder_overwrite')->nullable()->after('volume_bbg_rebate');
            }

            if (!Schema::hasColumn('programs_participants', 'flat_bbg_overwrite')) {
                $table->double('flat_bbg_overwrite')->nullable()->after('flat_builder_overwrite');
            }

            if(Schema::hasColumn('programs_participants','overwrite_amount_type')) {
                \Illuminate\Support\Facades\DB::statement("alter table programs_participants modify overwrite_amount_type enum('default', 'amount')  default 'default' null;");
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
            if (Schema::hasColumn('programs_participants', 'flat_builder_overwrite')) {
                $table->dropColumn('flat_builder_overwrite');
            }

            if (Schema::hasColumn('programs_participants', 'flat_bbg_overwrite')) {
                $table->dropColumn('flat_bbg_overwrite');
            }

            if(Schema::hasColumn('programs_participants','overwrite_amount_type')) {
                \Illuminate\Support\Facades\DB::statement("alter table programs_participants modify overwrite_amount_type enum('percentage', 'amount', 'tier') null;");
            }
        });
    }
}
