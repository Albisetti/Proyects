<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterBundle extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bundles', function (Blueprint $table) {

            if(!Schema::hasColumn('bundles','organization_id')) {
                $table->foreignId('organization_id')->constrained('organizations')->after('name'); //TODO: need to drop bundles on organization drop.
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
        Schema::table('bundles', function (Blueprint $table) {

            if(!Schema::hasColumn('bundles','organization_id')) {
                $table->dropForeign(['organization_id']);
            }
        });
    }
}
