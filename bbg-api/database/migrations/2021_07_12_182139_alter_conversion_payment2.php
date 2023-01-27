<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterConversionPayment2 extends Migration
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
            if(Schema::hasColumn('conversion_payment','note')) {
                $table->text('note')->nullable()->change();
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
            if(Schema::hasColumn('conversion_payment','note')) {
                $table->text('note')->change();
            }
        });
    }
}
