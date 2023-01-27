<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterBundlesProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('bundles_products_pivot', function (Blueprint $table) {

            if(!Schema::hasColumn('bundles_products_pivot','product_quantity')) {
                $table->integer('product_quantity')->default(1)->after('product_id');
            }

            if(!Schema::hasColumn('bundles_products_pivot','bundle_id')) {
                $table->foreignId('bundle_id')->onDelete('set null')->change();
            }

            if(!Schema::hasColumn('bundles_products_pivot','product_id')) {
                $table->foreignId('product_id')->onDelete('set null')->change();
            }
        });

        Schema::rename('bundles_products_pivot', 'bundles_products');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table('bundles_products', function (Blueprint $table) {

            if(Schema::hasColumn('bundles_products','product_quantity')) {
                $table->dropColumn('product_quantity');
            }

            if(!Schema::hasColumn('bundles_products','bundle_id')) {
                $table->foreignId('bundle_id')->onDelete()->change();
            }

            if(!Schema::hasColumn('bundles_products','product_id')) {
                $table->foreignId('product_id')->onDelete()->change();
            }
        });

        Schema::rename('bundles_products', 'bundles_products_pivot');
    }
}
