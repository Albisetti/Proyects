<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        if(Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if(!Schema::hasColumn('users','office_phone_ext')) {
                    $table->string('office_phone_ext')->default('')->after('office_phone');
                }

                if(Schema::hasColumn('users','address_id')) {
                    $table->dropConstrainedForeignId('address_id');
//                    $table->dropColumn('address_id');
                }
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
        if(Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if(Schema::hasColumn('users','office_phone_ext')) {
                    $table->dropColumn('office_phone_ext');
                }
            });
        }
    }
}
