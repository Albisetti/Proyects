<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterNewPrograms4 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('programs', function (Blueprint $table) {

            if(Schema::hasColumn('programs','global_product_rebate_amount_type')) {
                \Illuminate\Support\Facades\DB::statement("alter table programs modify lot_and_address_requirement enum('Address Only', 'Address Or Lot', 'Address Or Lot With Subdivision') null;");
                \Illuminate\Support\Facades\DB::statement("alter table programs modify bbg_rebate_unit enum('Per Unit', 'Per Install Unit') null;");
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
        Schema::table('programs', function (Blueprint $table) {

            if(Schema::hasColumn('programs','global_product_rebate_amount_type')) {
                \Illuminate\Support\Facades\DB::statement("alter table programs modify lot_and_address_requirement enum('Address Only', 'Address Or Lot', 'Address Or Lot With Subdivision') not null;");
                \Illuminate\Support\Facades\DB::statement("alter table programs modify bbg_rebate_unit enum('Per Unit', 'Per Install Unit') not null;");
            }

        });
    }
}
