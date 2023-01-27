<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\FloatType;
use Doctrine\DBAL\Types\Type;

class AlterProductUniqueOrgProduct extends Migration
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
            if (!Schema::hasColumn('products', 'cust_bbg_residential_amount')) {
                $table->double('cust_bbg_residential_amount')->nullable()->after('customization_id');
            }

            if (!Schema::hasColumn('products', 'cust_builder_residential_amount')) {
                $table->double('cust_builder_residential_amount')->nullable()->after('cust_bbg_residential_amount');
            }

            if (!Schema::hasColumn('products', 'cust_bbg_multi_unit_amount')) {
                $table->double('cust_bbg_multi_unit_amount')->nullable()->after('cust_builder_residential_amount');
            }

            if (!Schema::hasColumn('products', 'cust_builder_multi_unit_amount')) {
                $table->double('cust_builder_multi_unit_amount')->nullable()->after('cust_bbg_multi_unit_amount');
            }

            if (!Schema::hasColumn('products', 'cust_bbg_commercial_amount')) {
                $table->double('cust_bbg_commercial_amount')->nullable()->after('cust_builder_multi_unit_amount');
            }

            if (!Schema::hasColumn('products', 'cust_builder_commercial_amount')) {
                $table->double('cust_builder_commercial_amount')->nullable()->after('cust_bbg_commercial_amount');
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
            if (Schema::hasColumn('products', 'cust_bbg_residential_amount')) {
                $table->dropColumn('cust_bbg_residential_amount');
            }

            if (Schema::hasColumn('products', 'cust_builder_residential_amount')) {
                $table->dropColumn('cust_builder_residential_amount');
            }

            if (Schema::hasColumn('products', 'cust_bbg_multi_unit_amount')) {
                $table->dropColumn('cust_bbg_multi_unit_amount');
            }

            if (Schema::hasColumn('products', 'cust_builder_multi_unit_amount')) {
                $table->dropColumn('cust_builder_multi_unit_amount');
            }

            if (Schema::hasColumn('products', 'cust_bbg_commercial_amount')) {
                $table->dropColumn('cust_bbg_commercial_amount');
            }

            if (Schema::hasColumn('products', 'cust_builder_commercial_amount')) {
                $table->dropColumn('cust_builder_commercial_amount');
            }
        });
    }
}
