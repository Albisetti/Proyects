<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\FloatType;
use Doctrine\DBAL\Types\Type;

class AlterConversionActivity extends Migration
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
        Schema::table('conversionByActivity', function (Blueprint $table) {
            $table->double('bonus_amount')->nullable()->change();
            $table->double('residential_bonus_amount')->nullable();
            $table->double('multi_unit_bonus_amount')->nullable();
            $table->double('commercial_bonus_amount')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (!Type::hasType('double')) {
            Type::addType('double', FloatType::class);
        }

        //
        Schema::table('conversionByActivity', function (Blueprint $table) {
            $table->double('bonus_amount')->change();
            $table->dropColumn('residential_bonus_amount');
            $table->dropColumn('multi_unit_bonus_amount');
            $table->dropColumn('commercial_bonus_amount');
        });
    }
}
