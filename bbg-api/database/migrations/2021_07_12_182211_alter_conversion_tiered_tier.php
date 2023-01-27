<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterConversionTieredTier extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('conversionTiered_tier', function (Blueprint $table) {
            if(Schema::hasColumn('conversionTiered_tier','note')) {
                $table->text('note')->nullable()->change();
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
        Schema::table('conversionTiered_tier', function (Blueprint $table) {
            if(Schema::hasColumn('conversionTiered_tier','note')) {
                $table->text('note')->change();
            }
        });
    }
}
