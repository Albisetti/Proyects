<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRebateReportsProducts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rebateReports_products', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rebateReport_house_id')->nullable()->constrained('rebateReports_houses')->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();

            $table->integer('quantity')->default(0);

            $table->string('serial_number')->nullable();
            $table->string('model_number')->nullable();
            $table->string('brand')->nullable();

            $table->date('date_of_purchase')->nullable();
            $table->date('date_of_installation')->nullable();

            $table->foreignId('distributor_id')->nullable()->constrained('sub_contractors'); //TODO: Unsure on how to handle the delete, shouldn't happen, archive everything?

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
        Schema::dropIfExists('rebateReports_products');
    }
}
