<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClaimFilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('claim_files', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('claim_id');
            $table->foreign('claim_id')->on('claims')->references('id');
            $table->string('path', 256);
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
        Schema::dropIfExists('claim_files');
    }
}
