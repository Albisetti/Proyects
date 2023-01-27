<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrganizationsProjects extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('organizations_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('organizations');
            $table->foreignId('project_id')->constrained('projects');
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        Schema::table('projects', function (Blueprint $table) {
            if(Schema::hasColumn('projects','organization_id')) {
                $table->dropConstrainedForeignId('organization_id');
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
        Schema::dropIfExists('organizations_projects');

        Schema::table('projects', function (Blueprint $table) {
            if(!Schema::hasColumn('projects','organization_id')) {
                $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            }
        });
    }
}
