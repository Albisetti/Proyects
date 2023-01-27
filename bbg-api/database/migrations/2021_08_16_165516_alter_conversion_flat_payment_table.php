<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterConversionFlatPaymentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('conversionFlatPayment', function (Blueprint $table) {
			$table->dropColumn([
				'residential_bonus_amount',
				'multi_unit_bonus_amount',
				'commercial_bonus_amount'
			]);

			$table->double('bonus_amount');
		});
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('conversionFlatPayment', function (Blueprint $table) {
			$table->dropColumn('bonus_amount');

			$table->double('residential_bonus_amount');
			$table->double('multi_unit_bonus_amount');
			$table->double('commercial_bonus_amount');
		});
    }
}
