<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProducts3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
			$table->dropUnique('products_bbg_product_code_unique');
			$table->foreignId('supplier_id')->nullable()->constrained('organizations');
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
			$table->string('bbg_product_code', 255)->nullable()->unique()->change();
			$table->dropConstrainedForeignId('supplier_id');
		});
    }
}
