<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterProgram2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('programs', function (Blueprint $table) {
            if(Schema::hasColumn('programs','require_installer_pointer')){
                $table->dropColumn("require_installer_pointer");
            }

            if(Schema::hasColumn('programs','require_installer_company')){
                $table->dropColumn("require_installer_company");
            }

            if(Schema::hasColumn('programs','require_subcontractor_provider')){
                $table->dropColumn("require_subcontractor_provider");
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
        Schema::table('programs', function (Blueprint $table) {
            if(!Schema::hasColumn('programs','require_installer_pointer')){
                $table->boolean('require_installer_pointer')->default(false)->after('require_date_of_purchase');
            }

            if(!Schema::hasColumn('programs','require_installer_company')){
                $table->boolean('require_installer_company')->default(false)->after('require_installer_pointer');
            }

            if(!Schema::hasColumn('programs','require_subcontractor_provider')){
                $table->boolean('require_subcontractor_provider')->default(false)->after('require_installer_company');
            }
        });
    }
}
