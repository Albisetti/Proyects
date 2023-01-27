<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterTiersEnum extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('organizations', function (Blueprint $table) {

            if(Schema::hasColumn('organizations','member_tier')) {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE organizations MODIFY member_tier enum('none', 'gold', 'silver', 'bronze', 'Tier 1', 'Tier 2', 'Tier 3', 'founder') default 'none';");
                \Illuminate\Support\Facades\DB::update("UPDATE organizations SET member_tier = 'Tier 1' WHERE member_tier = 'bronze'");
                \Illuminate\Support\Facades\DB::update("UPDATE organizations SET member_tier = 'Tier 2' WHERE member_tier = 'silver'");
                \Illuminate\Support\Facades\DB::update("UPDATE organizations SET member_tier = 'Tier 3' WHERE member_tier = 'gold'");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE organizations MODIFY member_tier enum('none', 'Tier 1', 'Tier 2', 'Tier 3', 'founder') default 'none';");
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
        Schema::table('organizations', function (Blueprint $table) {

            if(Schema::hasColumn('organizations','member_tier')) {
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE organizations MODIFY member_tier enum('none', 'gold', 'silver', 'bronze', 'Tier 1', 'Tier 2', 'Tier 3', 'founder') default 'none';");
                \Illuminate\Support\Facades\DB::update("UPDATE organizations SET member_tier = 'bronze' WHERE member_tier = 'Tier 1'");
                \Illuminate\Support\Facades\DB::update("UPDATE organizations SET member_tier = 'silver' WHERE member_tier = 'Tier 2'");
                \Illuminate\Support\Facades\DB::update("UPDATE organizations SET member_tier = 'gold' WHERE member_tier = 'Tier 3'");
                \Illuminate\Support\Facades\DB::statement("ALTER TABLE organizations MODIFY member_tier enum('none', 'gold', 'silver', 'bronze', 'founder') default 'none';");
            }
        });
    }
}
