<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\FloatType;
use Doctrine\DBAL\Types\Type;


class AlterClaimsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Type::hasType('double')) {
            Type::addType('double', FloatType::class);
        }

        Schema::table('claims', function (Blueprint $table) {
            if(!Schema::hasColumn('claims','name')){
                $table->mediumText('name')->nullable()->after('id');
            }

            if(Schema::hasColumn('claims','claim_total_bbg')){
                $table->double('claim_total_bbg')->nullable()->change();
            }
            if(Schema::hasColumn('claims','claim_total_builders')){
                $table->double('claim_total_builders')->nullable()->change();
            }
            if(Schema::hasColumn('claims','volume_total_bbg')){
                $table->double('claim_total_builders')->nullable()->change();
            }
            if(Schema::hasColumn('claims','volume_total_builder')){
                $table->double('volume_total_builder')->nullable()->change();
            }
            if(Schema::hasColumn('claims','rebate_total_bbg')){
                $table->double('rebate_total_bbg')->nullable()->change();
            }
            if(Schema::hasColumn('claims','rebate_total_builder')){
                $table->double('rebate_total_builder')->nullable()->change();
            }
            if(Schema::hasColumn('claims','paid_total')){
                $table->double('paid_total')->nullable()->change();
            }
            if(Schema::hasColumn('claims','amount_owed_bbg')){
                $table->double('amount_owed_bbg')->nullable()->change();
            }
            if(Schema::hasColumn('claims','amount_owed_builder')){
                $table->double('amount_owed_builder')->nullable()->change();
            }
            if(Schema::hasColumn('claims','claim_paid_bbg')){
                $table->double('claim_paid_bbg')->nullable()->change();
            }
            if(Schema::hasColumn('claims','claim_paid_builder')){
                $table->double('claim_paid_builder')->nullable()->change();
            }
            if(Schema::hasColumn('claims','lost_disbute_bbg')){
                $table->double('lost_disbute_bbg')->nullable()->change();
            }
            if(Schema::hasColumn('claims','lost_disbute_builder')){
                $table->double('lost_disbute_builder')->nullable()->change();
            }
            if(Schema::hasColumn('claims','lost_type')){
                $table->double('lost_type')->nullable()->change();
            }
            if(Schema::hasColumn('claims','lost_description')){
                $table->double('lost_description')->nullable()->change();
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
    }
}
