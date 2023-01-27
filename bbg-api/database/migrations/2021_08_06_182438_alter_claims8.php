<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterClaims8 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('claims', function (Blueprint $table) {
            if (Schema::hasColumn('claims', 'claim_type')) {
                \Illuminate\Support\Facades\DB::statement("alter table claims modify claim_type enum('factory', 'volume') not null;");
            }
            if (Schema::hasColumn('claims', 'is_template')) {
                $table->dropColumn('is_template');
            }
            if (Schema::hasColumn('claims', 'claim_start_date')) {
                $table->dateTime('claim_start_date')->nullable()->change();
            }
            if (Schema::hasColumn('claims', 'claim_end_date')) {
                $table->dateTime('claim_end_date')->nullable()->change();
            }

            if (!Schema::hasColumn('claims', 'claim_template_product_type')) {
                $table->string('claim_template_product_type')->nullable()->after('claim_template_product_id');
            }

            if (Schema::hasColumn('claims', 'claims_claim_template_product_id_foreign')) {
                \Illuminate\Support\Facades\DB::statement("alter table claims drop foreign key claims_claim_template_product_id_foreign;");
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
        Schema::table('claims', function (Blueprint $table) {
            if (Schema::hasColumn('claims', 'claim_type')) {
                \Illuminate\Support\Facades\DB::statement("alter table claims modify claim_type enum('rebate', 'volume') not null;");
            }
            if (!Schema::hasColumn('claims', 'is_template')) {
                $table->boolean('is_template')->after('id');
            }
            if (Schema::hasColumn('claims', 'claim_start_date')) {
                $table->date('claim_start_date')->nullable()->change();
            }
            if (Schema::hasColumn('claims', 'claim_end_date')) {
                $table->date('claim_end_date')->nullable()->change();
            }
            if (Schema::hasColumn('claims', 'claim_template_product_type')) {
                $table->dropColumn('claim_template_product_type');
            }

            if (Schema::hasColumn('claims', 'claims_claim_template_product_id_foreign')) {
                \Illuminate\Support\Facades\DB::statement("alter table claims add constraint claims_claim_template_product_id_foreign foreign key (claim_template_product_id) references `organization_customProducts` (id);");
            }
        });
    }
}
