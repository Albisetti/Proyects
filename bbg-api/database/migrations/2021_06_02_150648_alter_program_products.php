<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProgramProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('products_programs', function (Blueprint $table) {

            if(!Schema::hasColumn('products_programs','rebate_amount_type')) {
                $table->dropColumn('rebate_amount_type');
            }

            if(Schema::hasColumn('products_programs','residential_rebate_amount')) {
                $table->dropColumn('residential_rebate_amount');
            }

            if(Schema::hasColumn('products_programs','multi_unit_rebate_amount')) {
                $table->dropColumn('multi_unit_rebate_amount');
            }

            if(Schema::hasColumn('products_programs','commercial_rebate_amount')) {
                $table->dropColumn('commercial_rebate_amount');
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
        Schema::table('products_programs', function (Blueprint $table) {

            if(!Schema::hasColumn('products_programs','rebate_amount_type')) {
                $table->enum('rebate_amount_type', ['percentage','amount'])->default('amount')->after('product_id');
            }

            if(!Schema::hasColumn('products_programs','residential_rebate_amount')) {
                $table->double('residential_rebate_amount')->nullable()->after('rebate_amount_type');
            }

            if(!Schema::hasColumn('products_programs','multi_unit_rebate_amount')) {
                $table->double('multi_unit_rebate_amount')->nullable()->after('residential_rebate_amount');
            }

            if(!Schema::hasColumn('products_programs','commercial_rebate_amount')) {
                $table->double('commercial_rebate_amount')->nullable()->after('multi_unit_rebate_amount');
            }
        });
    }
}
