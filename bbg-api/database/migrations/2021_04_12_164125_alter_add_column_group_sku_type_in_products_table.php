<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterAddColumnGroupSkuTypeInProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            if(!Schema::hasColumn('programs','bbg_product_code')){
                $table->string('bbg_product_code')->nullable()->after('id');
            }
            if(!Schema::hasColumn('programs','product_group')){
                $table->string('product_group')->nullable()->after('bbg_product_code');
            }
            if(!Schema::hasColumn('programs','product_type')){
                $table->string('product_type')->nullable()->after('description');
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
        Schema::table('products', function (Blueprint $table) {
            if(Schema::hasColumn('programs','bbg_product_code')){
                $table->dropColumn('bbg_product_code');
            }
            if(Schema::hasColumn('programs','product_group')){
                $table->dropColumn('product_group');
            }
            if(Schema::hasColumn('programs','product_type')){
                $table->dropColumn('product_type');
            }
        });
    }
}
