<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\FloatType;
use Doctrine\DBAL\Types\Type;

class AlterProductsPrograms extends Migration
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

        Schema::table('products_programs', function (Blueprint $table) {

            if(!Schema::hasColumn('products_programs','id')) {
                $table->id()->first();
            }

            if(!Schema::hasColumn('products_programs','minimum_unit')) {
                $table->integer('minimum_unit')->nullable()->after('product_id');
            }

            if(!Schema::hasColumn('products_programs','require_quantity_reporting')) {
                $table->boolean('require_quantity_reporting')->default(false)->after('minimum_unit');
            }

            if(!Schema::hasColumn('products_programs','rebate_amount_type')) {
                $table->enum('rebate_amount_type', ['percentage','amount'])->default('amount')->after('minimum_unit');
            }

            if(!Schema::hasColumn('products_programs','residential_rebate_amount')) {
                $table->double('residential_rebate_amount')->after('require_quantity_reporting');
            }

            if(!Schema::hasColumn('products_programs','multi_unit_rebate_amount')) {
                $table->double('multi_unit_rebate_amount')->after('residential_rebate_amount');
            }

            if(!Schema::hasColumn('products_programs','commercial_rebate_amount')) {
                $table->double('commercial_rebate_amount')->after('multi_unit_rebate_amount');
            }

            if(!Schema::hasColumn('products_programs','multi_reporting')) {
                $table->boolean('multi_reporting')->default(false)->after('commercial_rebate_amount');
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

//            if(Schema::hasColumn('products_programs','id')) {
//                $table->dropColumn('id');
//            }

            if(Schema::hasColumn('products_programs','minimum_unit')) {
                $table->dropColumn('minimum_unit');
            }

            if(Schema::hasColumn('products_programs','require_quantity_reporting')) {
                $table->dropColumn('require_quantity_reporting');
            }

            if(Schema::hasColumn('products_programs','rebate_amount_type')) {
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

            if(Schema::hasColumn('products_programs','multi_reporting')) {
                $table->dropColumn('multi_reporting');
            }
        });
    }
}
