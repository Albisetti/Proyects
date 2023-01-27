<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrganizationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->enum('organization_type',['builders','bbg','manufacturers','distributers','suppliers'])->nullable(false);
            $table->string('name', 256);
            $table->string('abbrevation',100)->nullable();
            $table->string('code', 100);
            $table->string('address', 256)->nullable(false);
            $table->string('address2', 256)->nullable();
            $table->unsignedInteger('city_id')->nullable(false);
            $table->unsignedInteger('state_id')->nullable(false);
            $table->string('zip_postal')->nullable(false);
            $table->string('phone_number',20)->nullable();
            $table->string('approved_states',100)->nullable();
            $table->text('notes')->nullable(true);
            $table->enum('member_tier', ['none','gold', 'silver','bronze'])->nullable(true)->default('none');
            $table->unsignedBigInteger('program_id')->nullable();
            $table->unsignedInteger('average_sq_footage')->nullable();
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
        Schema::dropIfExists('organizations');
    }
}
