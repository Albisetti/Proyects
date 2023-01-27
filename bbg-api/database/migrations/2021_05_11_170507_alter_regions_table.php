<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterRegionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('addresses', function (Blueprint $table) {

            if(Schema::hasColumn('addresses','addresses_city_id_foreign')){
                $table->dropForeign(['city_id']);
            }

            if(Schema::hasColumn('addresses','city_id')){
                $table->dropColumn('city_id');
            }

            if(!Schema::hasColumn('addresses','city')){
                $table->string("city")->after('zip_postal');
            }

            if(!Schema::hasColumn('addresses','state_id')){
                $table->foreignId('state_id')->nullable()->constrained('states')->cascadeOnDelete()->after('city');

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
        Schema::table('addresses', function (Blueprint $table) {

            if(!Schema::hasColumn('addresses','city_id')){
                $table->foreignId('city_id')->nullable()->constrained('cities')->cascadeOnDelete()->after('zip_postal');
            }

            if(Schema::hasColumn('addresses','city')){
                $table->dropColumn("city");
            }

            if(Schema::hasColumn('addresses','addresses_state_id_foreign')){
                $table->dropForeign(['state_id']);
            }

            if(Schema::hasColumn('addresses','state_id')){
                $table->dropColumn('state_id');
            }
        });
    }
}
