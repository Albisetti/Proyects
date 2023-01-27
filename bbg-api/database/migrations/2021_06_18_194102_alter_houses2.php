<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterHouses2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('houses', function (Blueprint $table) {

            if (!Schema::hasColumn('houses', 'confirmed_occupancy')) {
                $table->date('confirmed_occupancy')->nullable()->after('purchase_order_id');
            }

            if (!Schema::hasColumn('houses', 'project_number')) {
                $table->string('project_number')->nullable()->after('property_type');
            }

            if (!Schema::hasColumn('houses', 'model')) {
                $table->string('model')->nullable()->after('project_number');
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
        Schema::table('houses', function (Blueprint $table) {

            if (Schema::hasColumn('houses', 'confirmed_occupancy')) {
                $table->dropColumn('confirmed_occupancy');
            }

            if (Schema::hasColumn('houses', 'project_number')) {
                $table->dropColumn('project_number');
            }

            if (Schema::hasColumn('houses', 'model')) {
                $table->dropColumn('model');
            }
        });
    }
}
