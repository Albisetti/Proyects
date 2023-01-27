<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\FloatType;
use Doctrine\DBAL\Types\Type;

class AlterProgramFlatRebate extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Type::hasType('double')) {
            Type::addType('double', FloatType::class);
        }

        //
        Schema::table('programs', function (Blueprint $table) {
            if(!Schema::hasColumn('programs','is_flat_rebate')){
                $table->boolean('is_flat_rebate')->default(false)->after('volume_bbg_rebate');
            }

            if(!Schema::hasColumn('programs','flat_builder_rebate')){
                $table->double('flat_builder_rebate')->default(0)->after('is_flat_rebate');
            }

            if(!Schema::hasColumn('programs','flat_bbg_rebate')){
                $table->double('flat_bbg_rebate')->default(0)->after('flat_builder_rebate');
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
            if(Schema::hasColumn('programs','is_flat_rebate')){
                $table->dropColumn('is_flat_rebate');
            }

            if(Schema::hasColumn('programs','flat_builder_rebate')){
                $table->dropColumn('flat_builder_rebate');
            }

            if(Schema::hasColumn('programs','flat_bbg_rebate')){
                $table->dropColumn('flat_bbg_rebate');
            }
        });
    }
}
