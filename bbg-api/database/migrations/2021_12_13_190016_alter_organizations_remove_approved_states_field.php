<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizationsRemoveApprovedStatesField extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('organizations', function (Blueprint $table) {
            if(Schema::hasColumn('organizations','approved_states')){
                $table->dropColumn('approved_states');
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
        Schema::table('organizations', function (Blueprint $table) {
            if(!Schema::hasColumn('organizations','approved_states')){
                $table->string('approved_states',100)->nullable();
            }
        });
    }
}
