<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProductsTable extends Migration
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

//            if(!Schema::hasColumn('products','category_id')){
//                $table->integer('category_id')->after('name');
//            }

            if(!Schema::hasColumn('products','products_category_id_foreign') && !Schema::hasColumn('products','category_id') ){
                $table->foreignId('category_id')->constrained('product_categories');
            }

            if(!Schema::hasColumn('products','product_line')){
                $table->string('product_line')->nullable()->after('description');
            }

            if(Schema::hasColumn('products','quantity')){
                $table->integer('quantity')->nullable()->change();
            }

            if(Schema::hasColumn('products','description')){
                $table->text('description')->nullable()->change();
            }

            if(Schema::hasColumn('products','product_group')){
                $table->dropColumn('product_group');
            }

            if(Schema::hasColumn('products','product_type')){
                $table->dropColumn('product_type');
            }

            if(Schema::hasColumn('products','status')){
                $table->dropColumn('status');
            }

            if(Schema::hasColumn('products','organization_id')){
                $table->dropColumn('organization_id');
            }

            if(Schema::hasColumn('products','program_id')){
                $table->dropColumn('program_id');
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

            //TODO: does not properly remove column
            if(Schema::hasColumn('products','category_id')){
                $table->dropForeign('products_category_id_foreign');
            }

//            if(Schema::hasColumn('products','category_id')){
//                $table->dropColumn('category_id');
//            }

            if(Schema::hasColumn('products','product_line')){
                $table->dropColumn('product_line');
            }

            if(Schema::hasColumn('products','quantity')){
                $table->integer('quantity')->nullable(false)->change();
            }

            if(Schema::hasColumn('products','product_group')){
                $table->string('product_group')->nullable()->after('bbg_product_code');
            }

            if(Schema::hasColumn('products','product_type')){
                $table->string('product_type')->nullable()->after('description');
            }

            if(Schema::hasColumn('products','status')){
                $table->string('status', 100)->nullable();
            }

            if(Schema::hasColumn('products','description')){
                $table->text('description')->nullable(false)->change();
            }

            if(Schema::hasColumn('products','organization_id')){
                $table->unsignedBigInteger('organization_id')->nullable();
            }

            if(Schema::hasColumn('products','program_id')){
                $table->unsignedBigInteger('program_id')->nullable();
            }
        });
    }
}
