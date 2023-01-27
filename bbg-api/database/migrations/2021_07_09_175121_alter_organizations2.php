<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterOrganizations2 extends Migration
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

            if(!Schema::hasColumn('organizations','contact_first_name')){
                $table->string('contact_first_name')->nullable();
            }
            if(!Schema::hasColumn('organizations','contact_last_name')){
                $table->string('contact_last_name')->nullable();
            }
            if(!Schema::hasColumn('organizations','contact_title')){
                $table->string('contact_title')->nullable();
            }
            if(!Schema::hasColumn('organizations','contact_email')){
                $table->string('contact_email')->nullable();
            }
            if(!Schema::hasColumn('organizations','contact_office_phone')){
                $table->string('contact_office_phone')->nullable();
            }
            if(!Schema::hasColumn('organizations','contact_office_phone_ext')){
                $table->string('contact_office_phone_ext')->nullable();
            }
            if(!Schema::hasColumn('organizations','contact_mobile_phone')){
                $table->string('contact_mobile_phone')->nullable();
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

            if(!Schema::hasColumn('organizations','contact_first_name')){
                $table->dropColumn('contact_first_name');
            }
            if(!Schema::hasColumn('organizations','contact_last_name')){
                $table->dropColumn('contact_last_name');
            }
            if(!Schema::hasColumn('organizations','contact_title')){
                $table->dropColumn('contact_title');
            }
            if(!Schema::hasColumn('organizations','contact_email')){
                $table->dropColumn('contact_email');
            }
            if(!Schema::hasColumn('organizations','contact_office_phone')){
                $table->dropColumn('contact_office_phone');
            }
            if(!Schema::hasColumn('organizations','contact_office_phone_ext')){
                $table->dropColumn('contact_office_phone_ext');
            }
            if(!Schema::hasColumn('organizations','contact_mobile_phone')){
                $table->dropColumn('contact_mobile_phone');
            }
        });
    }
}
