<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterClaims7 extends Migration
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
            if (Schema::hasColumn('claims', 'status')) {
                $table->foreignId('claim_template_product_id')->nullable()->constrained('organization_customProducts')->after('program_id');
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
            if (Schema::hasColumn('claims', 'status')) {
                $table->dropConstrainedForeignId('claim_template_product_id');
            }
        });
    }
}
