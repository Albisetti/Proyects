<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClaimsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->enum('claim_type',['rebate','volume'])->nullable(false);
            $table->date('claim_start');
            $table->date('claim_end');
            $table->enum('report_period',['quarter','yearly'])->nullable(false);
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->double('claim_total_bbg',10,2);
            $table->double('claim_total_builders',10,2);
            $table->string('claim_status')->nullable(false);
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            //$table->unsignedBigInteger('house_id');
            $table->foreignId('house_id')->constrained('houses')->cascadeOnDelete();
            $table->string('CO'); //Certificate of occupancy, will be a file
            $table->unsignedBigInteger('product_id');
            $table->double('volume_total_bbg',10,2);
            $table->double('volume_total_builder');
            $table->double('rebate_total_bbg',10,2);
            $table->double('rebate_total_builder',10,2);
            $table->double('paid_total',10,2);
            $table->double('amount_owed_bbg',10,2);
            $table->double('amount_owed_builder',10,2);
            $table->double('claim_paid_bbg',10,2);
            $table->double('claim_paid_builder',10,2);
            $table->double('lost_disbute_bbg',10,2);
            $table->double('lost_disbute_builder',10,2);
            $table->string('lost_type');
            $table->text('lost_description');
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
        Schema::dropIfExists('claims');
    }
}
