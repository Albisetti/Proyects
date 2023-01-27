<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizationsTable extends Migration
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
                if (Schema::hasColumn("organizations", "address")) {
                    $table->dropColumn('address');
                }
                if (Schema::hasColumn("organizations", "address2")) {
                    $table->dropColumn('address2');
                }
                if (Schema::hasColumn("organizations", "city_id")) {
                    $table->dropColumn('city_id');
                }
                if (Schema::hasColumn("organizations", "state_id")) {
                    $table->dropColumn('state_id');
                }
                if (Schema::hasColumn("organizations", "zip_postal")) {
                    $table->dropColumn('zip_postal');
                }
                $table->foreignId('address_id')->after('code')->constrained('addresses')->cascadeOnDelete();
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
        if(Schema::hasTable("organizations")){
            Schema::table('organizations', function (Blueprint $table) {

                if (Schema::hasColumn("organizations", "address_id")) {
                    $table->dropConstrainedForeignId('address_id');
                    $table->dropColumn('address_id');
                }
                if (!Schema::hasColumn("organizations", "address")) {
                    $table->dropColumn('address');
                }
                if (!Schema::hasColumn("organizations", "address2")) {
                    $table->dropColumn('address2');
                }
                if (!Schema::hasColumn("organizations", "city_id")) {
                    $table->dropColumn('city_id');
                }
                if (!Schema::hasColumn("organizations", "state_id")) {
                    $table->dropColumn('state_id');
                }
                if (!Schema::hasColumn("organizations", "zip_postal")) {
                    $table->dropColumn('zip_postal');
                }
            });
        }
    }
}
