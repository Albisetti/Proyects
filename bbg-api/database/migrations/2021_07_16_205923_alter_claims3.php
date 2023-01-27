<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterClaims3 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('claims', function (Blueprint $table) {
            $table->dropConstrainedForeignId('organization_id');
            $table->foreignId('program_id')->nullable()->constrained('programs');
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
        Schema::table('claims', function (Blueprint $table) {
            $table->dropConstrainedForeignId('program_id');
            $table->foreignId('organization_id')->nullable()->constrained('organizations');
        });
    }
}
