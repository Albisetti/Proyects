<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePurchasingMastersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('purchasing_masters', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->unsignedBigInteger('house_id');
            $table->string('CO');
            $table->unsignedBigInteger('program_id');
            $table->unsignedBigInteger('rule_id');
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('line_item_claim_id');
            $table->double('line_item_program_value',10,2);
            $table->double('volume_total_bbg',10,2);
            $table->double('volume_total_builder',10,2);
            $table->double('rebate_total_bbg',10,2);
            $table->double('rebate_total_builder',10,2);
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
        Schema::dropIfExists('purchasing_masters');
    }
}
