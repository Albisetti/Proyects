<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProgram extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('programs', function (Blueprint $table) {
            if(!Schema::hasColumn('programs','company_id')){
                $table->foreignId("company_id")->nullable()->constrained('programCompanies');
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
        //
        Schema::table('programs', function (Blueprint $table) {
            if(Schema::hasColumn('programs','company_id')){
                $table->dropConstrainedForeignId('company_id');
            }
        });
    }
}
