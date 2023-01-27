<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConversionFlatPercent extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('conversionFlatPercent', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->foreignId('program_id')->nullable()->constrained('programs')->cascadeOnDelete();

            $table->date('anticipated_payment_date');
            $table->double('bonus_percent');
            $table->double('max_amount')->nullable();
            $table->enum('spend_time_range', ['year','quarter','month','all'])->default('year');
            $table->date('clock_start');

            $table->bigInteger("created_by")->nullable();
            $table->bigInteger("updated_by")->nullable();
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('conversionFlatPercent');
    }
}
