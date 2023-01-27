<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterAddUniqueConstraintOnProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Schema::table('products', function (Blueprint $table) {
            if(Schema::hasColumn('products','bbg_product_code')){
                $table->string('bbg_product_code')->unique()->change();
            }
            if(Schema::hasColumn('products','name')){
                $table->string('name')->unique()->change();
            }
        });
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
