<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterNewProgram2 extends Migration
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

            if(!Schema::hasColumn('programs','lot_and_address_requirement_type')) {
                $table->enum('lot_and_address_requirement_type', ['US','US And CA', 'CA', 'Custom'])->default('Custom')->after('lot_and_address_requirement');
            }

            if(!Schema::hasColumn('programs','product_minimum_unit_requirement')) {
                $table->enum('product_minimum_unit_requirement', ['No', 'Same For All', 'Custom'])->default('No')->after('global_product_minimum_unit');
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
        Schema::table('programs', function (Blueprint $table) {

            if(Schema::hasColumn('programs','lot_and_address_requirement_type')) {
                $table->dropColumn('lot_and_address_requirement_type');
            }

            if(Schema::hasColumn('programs','product_minimum_unit_requirement')) {
                $table->dropColumn('product_minimum_unit_requirement');
            }
        });
    }
}
