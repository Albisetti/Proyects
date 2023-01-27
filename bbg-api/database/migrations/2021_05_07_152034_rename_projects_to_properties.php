<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RenameProjectsToProperties extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::rename('projects', 'properties');
        Schema::rename('organizations_projects', 'organizations_properties');

        Schema::table('organizations_properties', function (Blueprint $table) {
            //
            if(Schema::hasColumn('organizations_properties','project_id')) {
                $table->renameColumn('project_id', 'property_id');
            }
        });

        Schema::table('sub_divisions', function (Blueprint $table) {
            //
            if(Schema::hasColumn('sub_divisions','project_id')) {
                $table->renameColumn('project_id', 'property_id');
            }
        });

        Schema::table('houses_projects', function (Blueprint $table) {
            //
            if(Schema::hasColumn('houses_projects','project_id')) {
                $table->renameColumn('project_id', 'property_id');
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
        Schema::rename('properties','projects');
        Schema::rename('organizations_properties','organizations_projects');

        Schema::table('organizations_properties', function (Blueprint $table) {
            //
            if(Schema::hasColumn('organizations_properties','project_id')) {
                $table->renameColumn('property_id','project_id');
            }
        });
    }
}
