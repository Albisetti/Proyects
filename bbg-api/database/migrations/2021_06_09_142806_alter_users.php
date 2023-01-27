<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsers extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('users', function (Blueprint $table) {

            if (!Schema::hasColumn("organizations", "require_user_account")) {
                $table->boolean('require_user_account')->default(true)->after('status');
            }

            if (!Schema::hasColumn("organizations", "disabled")) {
                $table->boolean('disabled')->default(false)->after('require_user_account');
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
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn("organizations", "require_user_account")) {
                $table->dropColumn('require_user_account');
            }
            if (Schema::hasColumn("organizations", "disabled")) {
                $table->dropColumn('disabled');
            }
        });
    }
}
