<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRegion extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('addresses', function (Blueprint $table) {
            $table->unsignedInteger('city_id')->after('zip_postal');
            $table->dropColumn(['city','state']);

            if(Schema::hasColumn('addresses','address')){
                $table->string('address')->nullable()->change();
            }

            if(Schema::hasColumn('addresses','zip_postal')){
                $table->string('zip_postal')->nullable()->change();
            }

            if(Schema::hasColumn('addresses','city_id')){
                $table->foreignId('city_id')->nullable()->change();
            }

            if(!Schema::hasColumn('addresses','lot_number')){
                $table->string('lot_number')->nullable();
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
        Schema::table('addresses', function (Blueprint $table) {
            $table->string('city');
            $table->string('state');
            $table->dropColumn(['city_id']);

                if(Schema::hasColumn('addresses','address')){
                    $table->string('address')->nullable(false)->change();
                }

                if(Schema::hasColumn('addresses','zip_postal')){
                    $table->string('zip_postal')->nullable(false)->change();
                }

                if(Schema::hasColumn('addresses','city_id')){
                    $table->foreignId('city_id')->nullable(false)->change();
                }

                if(Schema::hasColumn('addresses','lot_number')){
                    $table->dropColumn('lot_number');
                }
        });

    }
}
