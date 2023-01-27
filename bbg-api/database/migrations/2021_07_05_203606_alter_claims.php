<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterClaims extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('claims', function (Blueprint $table) {
            if(Schema::hasColumn('claims','program_id')){
                $table->dropConstrainedForeignId("program_id");
            }
            if(Schema::hasColumn('claims','house_id')){
                $table->dropConstrainedForeignId("house_id");
            }
            if(Schema::hasColumn('claims','CO')){
                $table->dropColumn("CO");
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
        Schema::table('claims', function (Blueprint $table) {
            if(!Schema::hasColumn('claims','program_id')){
                $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            }
            if(!Schema::hasColumn('claims','house_id')){
                $table->foreignId('house_id')->constrained('houses')->cascadeOnDelete();
            }
            if(!Schema::hasColumn('claims','CO')){
                $table->string('CO'); //Certificate of occupancy, will be a file
            }
        });
    }
}
