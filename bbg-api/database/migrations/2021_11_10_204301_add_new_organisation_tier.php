<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewOrganisationTier extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(Schema::hasTable("organizations")){
            Schema::table('organizations', function (Blueprint $table) {
                if(Schema::hasColumn('organizations','member_tier')) {
                    \Illuminate\Support\Facades\DB::statement("alter table organizations modify member_tier enum('none', 'gold', 'silver', 'bronze', 'founder')  default 'none';");
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
        if(Schema::hasTable("organizations")){
            Schema::table('organizations', function (Blueprint $table) {
                if(Schema::hasColumn('organizations','member_tier')) {
                    \Illuminate\Support\Facades\DB::statement("alter table organizations modify member_tier enum('none', 'gold', 'silver', 'bronze')  default 'none';");
                }
            });
        }
    }
}
