<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RebateReportUniqueOrgId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::table('rebateReports', function (Blueprint $table) {
            if(Schema::hasColumn('rebateReports','organization_id')) {
                \Illuminate\Support\Facades\DB::statement("alter table rebateReports drop foreign key rebatereports_organization_id_foreign;");
                \Illuminate\Support\Facades\DB::statement("drop index rebatereports_organization_id_foreign on rebateReports;");
                \Illuminate\Support\Facades\DB::statement("alter table rebateReports add constraint rebatereports_organization_id_foreign foreign key (organization_id) references organizations (id);");
                \Illuminate\Support\Facades\DB::statement("create unique index rebatereports_organization_id_foreign	on rebateReports (organization_id);");
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
        Schema::table('rebateReports', function (Blueprint $table) {
            if(Schema::hasColumn('rebateReports','organization_id')) {
                \Illuminate\Support\Facades\DB::statement("alter table rebateReports drop foreign key rebatereports_organization_id_foreign;");
                \Illuminate\Support\Facades\DB::statement("drop index rebatereports_organization_id_foreign on rebateReports;");
                \Illuminate\Support\Facades\DB::statement("alter table rebateReports add constraint rebatereports_organization_id_foreign foreign key (organization_id) references organizations (id);");
                \Illuminate\Support\Facades\DB::statement("create index rebatereports_organization_id_foreign	on rebateReports (organization_id);");
            }
        });
    }
}
