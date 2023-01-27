<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizations5 extends Migration
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
            if(!Schema::hasColumn('organizations','previousEarnedToDate')){
                $table->float('previousEarnedToDate')->nullable()->after('zip_postal');
            }
            $table->dropUnique('organizations_name_unique');
            $table->timestamp('archived_at')->nullable();
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
            if(Schema::hasColumn('organizations','previousEarnedToDate')){
                $table->removeColumn('previousEarnedToDate');
            }
            $table->dropColumn('archived_at');
            $table->string('name', 100)->nullable(false)->unique()->change();
        });
    }
}
