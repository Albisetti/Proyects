<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizations extends Migration
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
            if (Schema::hasColumn("organizations", "address_id")) {
                $table->dropConstrainedForeignId('address_id');
//                $table->dropColumn('address_id');
            }

            if(!Schema::hasColumn('organizations','state_id')){
                $table->foreignId('state_id')->nullable()->constrained('states')->nullOnDelete()->after('code');
            }

            if(!Schema::hasColumn('organizations','city')){
                $table->string('city')->nullable()->after('state_id');
            }

            if(!Schema::hasColumn('organizations','address')){
                $table->string('address')->nullable()->after('city');
            }

            if(!Schema::hasColumn('organizations','address2')){
                $table->string('address2')->nullable()->after('address');
            }

            if(!Schema::hasColumn('organizations','zip_postal')){
                $table->string('zip_postal')->nullable()->after('address2');
            }

            if(Schema::hasColumn('organizations','abbrevation')){
                $table->renameColumn('abbrevation','abbreviation');
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
            if (Schema::hasColumn("organizations", "address")) {
                $table->dropColumn('address');
            }
            if (Schema::hasColumn("organizations", "address2")) {
                $table->dropColumn('address2');
            }
            if (Schema::hasColumn("organizations", "city")) {
                $table->dropColumn('city');
            }
            if (Schema::hasColumn("organizations", "state_id")) {
                $table->dropConstrainedForeignId('state_id'); //TODO: change the other DropForeign to dropConstrainedForeignId

            }
            if (Schema::hasColumn("organizations", "zip_postal")) {
                $table->dropColumn('zip_postal');
            }
            if (!Schema::hasColumn("organizations", "address_id")) {
                $table->foreignId('address_id')->after('code')->constrained('addresses')->cascadeOnDelete();
            }

            if(Schema::hasColumn('organizations','abbreviation')){
                $table->renameColumn('abbreviation','abbrevation');
            }
        });
    }
}
