<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterDisputes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('disputes', function (Blueprint $table) {
            $table->dropConstrainedForeignId('house_id');
            \Illuminate\Support\Facades\DB::statement("alter table disputes modify organization_id bigint unsigned null;");
            $table->foreignId('rebateReportHouseProduct_id')->constrained('rebateReports_houses_products')->after('organization_id');
            $table->integer('new_product_quantity')->nullable()->after('rebateReportHouseProduct_id');
            $table->float('new_rebate_earned')->nullable()->after('new_product_quantity');
            $table->float('new_rebate_paid')->nullable()->after('new_rebate_earned');
            $table->float('new_builder_allocation')->nullable()->after('new_rebate_paid');
            $table->text('note')->nullable()->after('new_builder_allocation');
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
        Schema::table('disputes', function (Blueprint $table) {
            $table->foreignId('house_id')->constrained('houses')->cascadeOnDelete()->after('organization_id');
            \Illuminate\Support\Facades\DB::statement("alter table disputes modify organization_id bigint unsigned not null;");
            $table->dropConstrainedForeignId('rebateReportHouseProduct_id');
            $table->dropColumn('new_product_quantity');
            $table->dropColumn('new_rebate_earned');
            $table->dropColumn('new_rebate_paid');
            $table->dropColumn('new_builder_allocation');
            $table->dropColumn('note');
        });
    }
}
