<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterColumnProofPointsTypeInProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('programs', function (Blueprint $table) {
            if(Schema::hasColumn('programs','required_proof_points')){
                $table->json('required_proof_points')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('programs', function (Blueprint $table) {
            if(Schema::hasColumn('programs','required_proof_points')){
                $table->unsignedInteger('required_proof_points')->nullable()->change();
            }
        });
    }
}
