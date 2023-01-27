<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterDuesPaymentHistorical extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('dues_payment', function (Blueprint $table) {
            if (!Schema::hasColumn('dues_payment', 'payment_quarter')) {
                $table->integer('payment_quarter')
//                    ->nullable()
                    ->after('status');
            }
            if (!Schema::hasColumn('dues_payment', 'payment_year')) {
                $table->integer('payment_year')
//                    ->nullable()
                    ->after('payment_quarter');
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
        Schema::table('dues_payment', function (Blueprint $table) {
            if (Schema::hasColumn('dues_payment', 'payment_quarter')) {
                $table->dropColumn('payment_quarter');
            }
            if (Schema::hasColumn('dues_payment', 'payment_year')) {
                $table->dropColumn('payment_year');
            }
        });
    }
}
