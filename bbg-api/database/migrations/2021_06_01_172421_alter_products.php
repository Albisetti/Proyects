<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('products', function (Blueprint $table) {

            if(!Schema::hasColumn('products','minimum_unit')) {
                $table->integer('minimum_unit')->nullable()->after('name');
            }

            if(!Schema::hasColumn('products','require_quantity_reporting')) {
                $table->boolean('require_quantity_reporting')->default(false)->after('minimum_unit');
            }

            if(Schema::hasColumn('products','quantity')) {
                $table->dropColumn('quantity');
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

            if(Schema::hasColumn('products','minimum_unit')) {
                $table->dropColumn('minimum_unit');
            }

            if(Schema::hasColumn('products','require_quantity_reporting')) {
                $table->dropColumn('require_quantity_reporting');
            }

            if(!Schema::hasColumn('products','quantity')) {
                $table->integer('quantity')->default(0);
            }
        });
    }
}
