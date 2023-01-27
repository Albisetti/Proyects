<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSubContractor2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sub_contractors', function (Blueprint $table) {

            if (Schema::hasColumn('sub_contractors', 'organization_id')) {
                $table->dropForeign(['organization_id']);
                $table->dropColumn('organization_id');
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
        Schema::table('sub_contractors', function (Blueprint $table) {

            if (!Schema::hasColumn('sub_contractors', 'organization_id')) {
                $table->foreignId('organization_id')->constrained('organizations');//TODO: errors out the first run?
            }
        });
    }
}
