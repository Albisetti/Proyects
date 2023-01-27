<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterHousesAddress extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('houses', function (Blueprint $table) {

            if(Schema::hasColumn('houses','status')){
                $table->dropColumn('status');//Change to/from enum not supported need to drop, save and then add
            }

            if(Schema::hasColumn('houses','expected_completion_date')){
                $table->date('expected_completion_date')->nullable()->change();
            }

            if(Schema::hasColumn('houses','square_footage')){
                $table->unsignedInteger('square_footage')->nullable()->change();
            }

            if(Schema::hasColumn('houses','address_id')){
                $table->dropColumn('address_id');
            }

            if(!Schema::hasColumn('houses','address')){
                $table->String('address')->nullable()->after('organization_id');
            }

            if(!Schema::hasColumn('houses','address2')){
                $table->String('address2')->nullable()->after('address');
            }

            if(!Schema::hasColumn('houses','zip_postal')){
                $table->String('zip_postal')->nullable()->after('address2');
            }

            if(!Schema::hasColumn('houses','lot_number')){
                $table->String('lot_number')->nullable()->after('zip_postal');
            }

            if(!Schema::hasColumn('houses','city')){
                $table->String('city')->nullable()->after('lot_number');
            }

            if(!Schema::hasColumn('houses','state_id')){
                $table->foreignId('state_id')->nullable()->constrained('states')->cascadeOnDelete()->after('city');
            }
        });

        Schema::table('houses', function (Blueprint $table) {
            if(!Schema::hasColumn('houses','status')){
                $table->enum('status', ["active","archived","deleted","draft"])->default("draft")->after('id'); //Change to/from enum not supported need to drop, save and then add
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
        Schema::table('houses', function (Blueprint $table) {

            if(Schema::hasColumn('houses','status')){
                $table->dropColumn('status');
                //Change to/from enum not supported need to drop, save and then add
            }

            if(Schema::hasColumn('houses','expected_completion_date')){
                $table->date('expected_completion_date')->nullable(false)->change();
            }

            if(Schema::hasColumn('houses','square_footage')){
                $table->unsignedInteger('square_footage')->nullable(false)->change();
            }

            if(!Schema::hasColumn('houses','address_id')){
                $table->unsignedBigInteger('address_id')->after('organization_id');
            }

            if(Schema::hasColumn('houses','address')){
                $table->dropColumn('address');
            }

            if(Schema::hasColumn('houses','address2')){
                $table->dropColumn('address2');
            }

            if(Schema::hasColumn('houses','zip_postal')){
                $table->dropColumn('zip_postal');
            }

            if(Schema::hasColumn('houses','lot_number')){
                $table->dropColumn('lot_number');
            }

            if(Schema::hasColumn('houses','city')){
                $table->dropColumn('city');
            }

            if(Schema::hasColumn('houses','houses_state_id_foreign')){
                $table->dropForeign(['state_id']);
            }
        });

        Schema::table('houses', function (Blueprint $table) {
            if(!Schema::hasColumn('houses','status')){
                $table->string('status')->after('expected_completion_date');
                //Change to/from enum not supported need to drop, save and then add
            }
        });
    }
}
