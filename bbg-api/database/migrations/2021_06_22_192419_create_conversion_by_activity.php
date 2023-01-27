<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConversionByActivity extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('conversionByActivity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->nullable()->constrained('programs')->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->enum('measure_unit', ['money','product','property'])->default('money');
            $table->double('trigger_amount');
            $table->string('bonus_name')->nullable();
            $table->enum('bonus_type', ['flat amount','rebate percent increase','rebate percent increase per unit', 'rebate amount increase per unit']);
            $table->double('bonus_amount');
            $table->enum('product_included', ['all','specifics'])->nullable();

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
        Schema::dropIfExists('conversionByActivity');
    }
}
