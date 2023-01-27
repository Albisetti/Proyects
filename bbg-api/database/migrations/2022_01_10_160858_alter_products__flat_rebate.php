<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\FloatType;
use Doctrine\DBAL\Types\Type;

class AlterProductsFlatRebate extends Migration
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

        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'flat_builder_rebate')) {
                $table->double('flat_builder_rebate')->nullable()->after('commercial_rebate_amount');
            }

            if (!Schema::hasColumn('products', 'flat_bbg_rebate')) {
                $table->double('flat_bbg_rebate')->nullable()->after('flat_builder_rebate');
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

        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'flat_builder_rebate')) {
                $table->dropColumn('flat_builder_rebate');
            }

            if (Schema::hasColumn('products', 'flat_bbg_rebate')) {
                $table->dropColumn('flat_bbg_rebate');
            }
        });
    }
}
