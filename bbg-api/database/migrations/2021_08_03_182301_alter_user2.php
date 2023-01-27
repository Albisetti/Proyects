<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUser2 extends Migration
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
            if(Schema::hasColumn('users','mobile_number')) {
                $table->renameColumn('mobile_number','mobile_phone');
            }

            if(!Schema::hasColumn('users','state_id')){
                $table->foreignId('state_id')->nullable()->constrained('states')->nullOnDelete()->after('office_phone_ext');
            }

            if(!Schema::hasColumn('users','city')){
                $table->string('city')->nullable()->after('state_id');
            }

            if(!Schema::hasColumn('users','address')){
                $table->string('address')->nullable()->after('city');
            }

            if(!Schema::hasColumn('users','address2')){
                $table->string('address2')->nullable()->after('address');
            }

            if(!Schema::hasColumn('users','zip_postal')){
                $table->string('zip_postal')->nullable()->after('address2');
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
            if(Schema::hasColumn('users','mobile_number')) {
                $table->renameColumn('mobile_phone','mobile_number');
            }

            if(Schema::hasColumn('users','state_id')){
                $table->dropConstrainedForeignId('state_id');
            }

            if(Schema::hasColumn('users','city')){
                $table->dropColumn('city');
            }

            if(Schema::hasColumn('users','address')){
                $table->dropColumn('address');
            }

            if(Schema::hasColumn('users','address2')){
                $table->dropColumn('address2');
            }

            if(Schema::hasColumn('users','zip_postal')){
                $table->dropColumn('zip_postal');
            }
        });
    }
}
