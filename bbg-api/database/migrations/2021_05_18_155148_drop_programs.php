<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropPrograms extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('programs', function (Blueprint $table) {
            $table->dropColumn('program_type');
            $table->dropColumn('program_name');
            $table->dropColumn('internal_description');
            $table->dropColumn('builder_description');
            $table->dropColumn('builder_description_short');
            $table->dropForeign(['organization_id']);
            $table->dropColumn('organization_id');
            $table->dropColumn('external_link');
            $table->dropColumn('required_proof_points');
            $table->dropColumn('program_rule_id');
            $table->dropColumn('address_id');
            $table->dropColumn('program_unit');
            $table->dropColumn('min_threshold');
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
            $table->dropColumn('archived_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        Schema::table('programs', function (Blueprint $table) {
            $table->enum('program_type',['factory','volume']);
            $table->string('program_name')->nullable(false);
            $table->mediumText('internal_description')->nullable(true);
            $table->text('builder_description')->nullable(true);
            $table->mediumText('builder_description_short')->nullable();
            $table->unsignedBigInteger('organization_id');
            $table->foreign('organization_id')->on('organizations')->references('id');
            $table->string('external_link');
            $table->json('required_proof_points')->nullable();
            $table->unsignedBigInteger('program_rule_id')->nullable(true);
            $table->unsignedBigInteger('address_id')->nullable()->nullable();
            $table->enum('program_unit',['volume','unit','per_house'])->nullable(false);
            $table->integer('min_threshold')->default(0);
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes('archived_at')->comment('Use to archive record');
        });
    }
}
