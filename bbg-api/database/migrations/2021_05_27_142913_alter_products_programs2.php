<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProductsPrograms2 extends Migration
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

            if(Schema::hasColumn('products_programs','rebate_amount_type')) {
                \Illuminate\Support\Facades\DB::statement("alter table products_programs modify rebate_amount_type enum('percentage', 'amount', 'tier') default 'amount';");
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

            if(Schema::hasColumn('products_programs','rebate_amount_type')) {
                \Illuminate\Support\Facades\DB::statement("alter table products_programs modify rebate_amount_type enum('percentage', 'amount') default 'amount';");
            }
        });
    }
}
