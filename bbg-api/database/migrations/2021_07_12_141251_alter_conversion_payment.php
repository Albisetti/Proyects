<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterConversionPayment extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('conversion_payment', function (Blueprint $table) {
            if(Schema::hasColumn('conversion_payment','payment_date')) {
                $table->dateTime('payment_date')->nullable()->change();
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
        Schema::table('conversion_payment', function (Blueprint $table) {
            if(Schema::hasColumn('conversion_payment','payment_date')) {
                $table->date('payment_date')->change();
            }
        });
    }
}
