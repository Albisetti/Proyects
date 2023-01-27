<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('organization_id');
            $table->unsignedBigInteger('address_id');
            $table->unsignedBigInteger('program_id');
            $table->unsignedBigInteger('rule_id');
            $table->unsignedBigInteger('builder_id');
            $table->unsignedBigInteger('house_id');
            $table->enum('status',['paid','processing','cancelled','refund']);
            $table->double('discount_percentage',10,2)->default(0);
            $table->double('discount_amount',10,2)->default(0);
            $table->double('invoice_total',10,2)->default(0);
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
        Schema::dropIfExists('invoices');
    }
}
