<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSubcontractor extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('sub_contractors', function (Blueprint $table) {

            if(!Schema::hasColumn('sub_contractors','office_number_ext')){
                $table->string('office_number_ext')->nullable()->after('office_number');
            }

            if(Schema::hasColumn('sub_contractors','address_id')){
                $table->dropConstrainedForeignId('address_id');
            }

            if(!Schema::hasColumn('sub_contractors','state_id')){
                $table->foreignId('state_id')->constrained('states')->cascadeOnDelete()->after('mobile_number');
            }

            if(!Schema::hasColumn('sub_contractors','city')){
                $table->string('city')->nullable()->after('state_id');
            }

            if(!Schema::hasColumn('sub_contractors','address')){
                $table->string('address')->nullable()->after('city');
            }

            if(!Schema::hasColumn('sub_contractors','address2')){
                $table->string('address2')->nullable()->after('address');
            }

            if(!Schema::hasColumn('sub_contractors','zip_postal')){
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
        Schema::table('sub_contractors', function (Blueprint $table) {

            if(Schema::hasColumn('sub_contractors','office_number_ext')){
                $table->dropColumn('office_number_ext');
            }

            if(!Schema::hasColumn('sub_contractors','address_id')){
                $table->foreignId('address_id')->constrained('addresses')->cascadeOnDelete();
            }

            if(Schema::hasColumn('sub_contractors','state_id')){
                $table->dropConstrainedForeignId('state_id');
            }

            if(Schema::hasColumn('sub_contractors','city')){
                $table->dropColumn('city');
            }

            if(Schema::hasColumn('sub_contractors','address')){
                $table->dropColumn('address');
            }

            if(Schema::hasColumn('sub_contractors','address2')){
                $table->dropColumn('address2');
            }

            if(Schema::hasColumn('sub_contractors','zip_postal')){
                $table->dropColumn('zip_postal');
            }
        });
    }
}
