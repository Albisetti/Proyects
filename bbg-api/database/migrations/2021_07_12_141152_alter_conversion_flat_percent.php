<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterConversionFlatPercent extends Migration
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
            if(Schema::hasColumn('conversionFlatPayment','anticipated_payment_date')) {
                $table->dateTime('anticipated_payment_date')->nullable()->change();
            }
            if(Schema::hasColumn('conversionFlatPayment','clock_start')) {
                $table->dateTime('clock_start')->nullable()->change();
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
        Schema::table('conversionFlatPayment', function (Blueprint $table) {
            if(Schema::hasColumn('conversionFlatPayment','anticipated_payment_date')) {
                $table->date('anticipated_payment_date')->change();
            }
            if(Schema::hasColumn('conversionFlatPayment','clock_start')) {
                $table->date('clock_start')->change();
            }
        });
    }
}
