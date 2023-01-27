<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRebateReportHouseProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rebateReports_houses_products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rebateReport_id')->nullable()->constrained('rebateReports')->nullOnDelete();
            $table->foreignId('house_id')->nullable()->constrained('houses')->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();

            $table->enum('status', ['action required', 'rebate ready', 'completed'])->nullable(true)->default('action required');

            $table->integer('product_quantity')->default(1);

            $table->string('product_serial_number')->nullable();
            $table->string('product_model_number')->nullable();
            $table->string('product_brand')->nullable();

            $table->dateTime('product_date_of_purchase')->nullable();
            $table->dateTime('product_date_of_installation')->nullable();

            $table->foreignId('subcontractor_provider_id')->nullable()->constrained('sub_contractors'); //TODO: Unsure on how to handle the delete, shouldn't happen, archive everything?

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
        Schema::dropIfExists('rebateReports_houses_products');
    }
}
