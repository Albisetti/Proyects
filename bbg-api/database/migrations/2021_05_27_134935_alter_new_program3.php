<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterNewProgram3 extends Migration
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
                \Illuminate\Support\Facades\DB::statement("alter table programs modify global_product_rebate_amount_type enum('percentage', 'amount', 'tier') null;");
            }

            if(Schema::hasColumn('programs','lot_and_address_requirement_type')) {
                $table->renameColumn('lot_and_address_requirement_type', 'valid_region_type')->change();
            }

            if(!Schema::hasColumn('programs','require_installer_pointer')) {
                $table->boolean('require_installer_pointer')->default(false)->after('require_date_of_purchase');
            }

            if(!Schema::hasColumn('programs','require_installer_company')) {
                $table->boolean('require_installer_company')->default(false)->after('require_installer_pointer');
            }

            if(!Schema::hasColumn('programs','require_distributor')) {
                $table->boolean('require_distributor')->default(false)->after('require_installer_company');
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
                \Illuminate\Support\Facades\DB::statement("alter table programs modify global_product_rebate_amount_type enum('percentage', 'amount') null;");
            }

            if(Schema::hasColumn('programs','valid_region_type')) {
                $table->renameColumn('valid_region_type', 'lot_and_address_requirement_type')->change();
            }

            if(!Schema::hasColumn('programs','require_installer_pointer')) {
                $table->dropColumn('require_installer_pointer');
            }

            if(Schema::hasColumn('programs','require_installer_company')) {
                $table->dropColumn('require_installer_company');
            }

            if(Schema::hasColumn('programs','require_distributor')) {
                $table->dropColumn('require_distributor');
            }
        });
    }
}
