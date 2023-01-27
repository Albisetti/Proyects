<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterAddColumnBuilderDescriptionShortInProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('programs', function (Blueprint $table) {
            if(!Schema::hasColumn('programs','builder_description_short')){
                $table->mediumText('builder_description_short')->nullable()->after('internal_description');
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
        Schema::table('programs', function (Blueprint $table) {
            if(Schema::hasColumn('programs','builder_description_short')){
                $table->dropColumn('builder_description_short');
            }
        });
    }
}
