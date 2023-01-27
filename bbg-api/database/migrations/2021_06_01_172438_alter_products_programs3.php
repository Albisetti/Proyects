<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProductsPrograms3 extends Migration
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

            if(Schema::hasColumn('products_programs','minimum_unit')) {
                $table->dropColumn('minimum_unit');
            }

            if(Schema::hasColumn('products_programs','require_quantity_reporting')) {
                $table->dropColumn('require_quantity_reporting');
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

            if(!Schema::hasColumn('products_programs','minimum_unit')) {
                $table->integer('minimum_unit')->nullable()->after('product_id');
            }

            if(!Schema::hasColumn('products_programs','require_quantity_reporting')) {
                $table->boolean('require_quantity_reporting')->default(false)->after('minimum_unit');
            }
        });
    }
}
