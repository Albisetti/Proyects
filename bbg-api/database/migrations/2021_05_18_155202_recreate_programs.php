<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class RecreatePrograms extends Migration
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
            $table->string('name');
            $table->enum('type',['factory','volume']);
            $table->date('start_date');
            $table->date('end_date');

            $table->boolean('all_builder_report_quantity')->default(true);
            $table->enum('bbg_rebate_unit', ['Per Unit', 'Per Install Unit']);

            $table->enum('lot_and_address_requirement', ['Address Only', 'Address Or Lot', 'Address Or Lot With Subdivision']);

            $table->boolean('require_certificate_occupancy')->default(false);
            $table->boolean('require_subcontractor_provider')->default(false);
            $table->boolean('require_brand')->default(false);
            $table->boolean('require_serial_number')->default(false);
            $table->boolean('require_model_number')->default(false);
            $table->boolean('require_date_of_installation')->default(false);
            $table->boolean('require_date_of_purchase')->default(false);

            $table->text('internal_description')->nullable();
            $table->text('builder_description')->nullable();
            $table->mediumText('builder_description_short')->nullable();
            $table->string('learn_more_url')->nullable();

            $table->bigInteger("created_by")->nullable();
            $table->bigInteger("updated_by")->nullable();
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
            $table->softDeletes('archived_at')->comment('Use to archive record');
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
            $table->dropColumn('name');
            $table->dropColumn('type');
            $table->dropColumn('start_date');
            $table->dropColumn('end_date');

            $table->dropColumn('all_builder_report_quantity');
            $table->dropColumn('bbg_rebate_unit');

            $table->dropColumn('lot_and_address_requirement');

            $table->dropColumn('require_certificate_occupancy');
            $table->dropColumn('require_subcontractor_provider');
            $table->dropColumn('require_brand');
            $table->dropColumn('require_serial_number');
            $table->dropColumn('require_model_number');
            $table->dropColumn('require_date_of_installation');
            $table->dropColumn('require_date_of_purchase');

            $table->dropColumn('internal_description');
            $table->dropColumn('builder_description');
            $table->dropColumn('builder_description_short');
            $table->dropColumn('learn_more_url');

            $table->dropColumn("created_by");
            $table->dropColumn("updated_by");
            $table->dropColumn('created_at');
            $table->dropColumn('updated_at');
            $table->dropColumn('archived_at');
        });

    }
}
