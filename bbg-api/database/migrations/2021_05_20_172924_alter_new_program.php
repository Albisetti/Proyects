<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterNewProgram extends Migration
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

            if(!Schema::hasColumn('programs','global_product_minimum_unit')) {
                $table->integer('global_product_minimum_unit')->nullable()->after('learn_more_url');
            }

            if(!Schema::hasColumn('programs','global_product_rebate_amount_type')) {
                $table->enum('global_product_rebate_amount_type', ['percentage','amount'])->nullable()->after('global_product_minimum_unit');
            }

            if(!Schema::hasColumn('programs','global_product_residential_rebate_amount')) {
                $table->double('global_product_residential_rebate_amount')->nullable()->after('global_product_rebate_amount_type');
            }

            if(!Schema::hasColumn('programs','global_product_multi_unit_rebate_amount')) {
                $table->double('global_product_multi_unit_rebate_amount')->nullable()->after('global_product_residential_rebate_amount');
            }

            if(!Schema::hasColumn('programs','global_product_commercial_rebate_amount')) {
                $table->double('global_product_commercial_rebate_amount')->nullable()->after('global_product_multi_unit_rebate_amount');
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
            if(Schema::hasColumn('programs','global_product_minimum_unit')) {
                $table->dropColumn('global_product_minimum_unit');
            }

            if(Schema::hasColumn('programs','global_product_rebate_amount_type')) {
                $table->dropColumn('global_product_rebate_amount_type');
            }

            if(Schema::hasColumn('programs','global_product_residential_rebate_amount')) {
                $table->dropColumn('global_product_residential_rebate_amount');
            }

            if(Schema::hasColumn('programs','global_product_multi_unit_rebate_amount')) {
                $table->dropColumn('global_product_multi_unit_rebate_amount');
            }

            if(Schema::hasColumn('programs','global_product_commercial_rebate_amount')) {
                $table->dropColumn('global_product_commercial_rebate_amount');
            }
        });
    }
}
