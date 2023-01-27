<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterConversionsDeletedAt extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('conversionFlatPayment', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('conversionFlatPercent', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('conversionTierPercent', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('conversionTiered_tier', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('conversionByActivity', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('conversion_payment', function (Blueprint $table) {
            $table->softDeletes();
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
        Schema::table('conversionFlatPayment', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
        Schema::table('conversionFlatPercent', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
        Schema::table('conversionTierPercent', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
        Schema::table('conversionTiered_tier', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
        Schema::table('conversionByActivity', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
        Schema::table('conversion_payment', function (Blueprint $table) {
            $table->dropColumn('deleted_at');
        });
    }
}
