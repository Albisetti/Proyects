<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->enum('program_type',['factory','volume']);
            $table->string('program_name')->nullable(false);
            $table->mediumText('internal_description')->nullable(true);
            $table->text('builder_description')->nullable(true);
            $table->unsignedBigInteger('organization_id');
            $table->foreign('organization_id')->on('organizations')->references('id');
            $table->string('external_link');
            $table->unsignedBigInteger('program_rule_id')->nullable(true);
            $table->unsignedBigInteger('address_id')->nullable();
            $table->enum('program_unit',['volume','unit','per_house'])->nullable(false);
            $table->integer('min_threshold')->default(0);
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes('archived_at')->comment('Use to archive record');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('programs');
    }
}
