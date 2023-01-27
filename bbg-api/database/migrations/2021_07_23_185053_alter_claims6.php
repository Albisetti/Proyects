<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterClaims6 extends Migration
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
            if (Schema::hasColumn('claims', 'status')) {
                \Illuminate\Support\Facades\DB::statement("alter table claims modify status enum('open', 'ready', 'submitted', 'disputed','ready to close','close') default 'open' not null;");
            }
            if (!Schema::hasColumn('claims', 'report_quarter')) {
                $table->integer('report_quarter')->nullable()->after('report_period');
            }
            if (!Schema::hasColumn('claims', 'report_year')) {
                $table->integer('report_year')->nullable()->after('report_quarter');
            }
            if (Schema::hasColumn('claims', 'report_period')) {
                $table->dropColumn('report_period');
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
            if (Schema::hasColumn('claims', 'status')) {
                \Illuminate\Support\Facades\DB::statement("alter table claims modify status enum('open','close') default 'open' not null;");
            }
            if (!Schema::hasColumn('claims', 'report_period')) {
                $table->string('report_period')->nullable()->after('report_year');
            }
            if (Schema::hasColumn('claims', 'report_quarter')) {
                $table->dropColumn('report_quarter');
            }
            if (Schema::hasColumn('claims', 'report_year')) {
                $table->dropColumn('report_year');
            }
        });
    }
}
