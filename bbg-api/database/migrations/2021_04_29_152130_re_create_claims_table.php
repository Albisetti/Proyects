<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\FloatType;
use Doctrine\DBAL\Types\Type;

class ReCreateClaimsTable extends Migration
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

            if(!Schema::hasColumn('claims','is_template')){
                $table->boolean('is_template')->after('id');
            }

            if(Schema::hasColumn('claims','report_period')){
                $table->string('report_period')->nullable()->change();
            }

            if(Schema::hasColumn('claims','claim_start')){
                $table->dropColumn('claim_start');
                $table->date('claim_start_date')->nullable()->after('report_period');
            }
            if(Schema::hasColumn('claims','claim_end')){
                $table->dropColumn('claim_end');
                $table->date('claim_end_date')->nullable()->after('claim_start_date');
            }

            if(!Schema::hasColumn('claims','total_payment_rebate')){
                $table->double('total_payment_rebate',10,2)->nullable()->after('claim_end_date');
            }

            if(!Schema::hasColumn('claims','report_total')){
                $table->double('report_total',10,2)->nullable()->after('total_payment_rebate');
            }

            if(!Schema::hasColumn('claims','organization_id')){
                $table->foreignId('organization_id')->nullable()->change();
            }

            if(!Schema::hasColumn('claims','program_id')){
                $table->foreignId('program_id')->nullable()->change();
            }

            if(!Schema::hasColumn('claims','house_id')){
                $table->foreignId('house_id')->nullable()->change();
            }

            if(!Schema::hasColumn('claims','claim_status')){
                $table->string('claim_status')->nullable()->change();
            }

            if(!Schema::hasColumn('claims','CO')){
                $table->string('CO')->nullable()->change();
            }

            if(Schema::hasColumn('claims','claim_total_bbg')){
                $table->dropColumn('claim_total_bbg');
            }
            if(Schema::hasColumn('claims','claim_total_builders')){
                $table->dropColumn('claim_total_builders');
            }
            if(Schema::hasColumn('claims','product_id')){
                $table->dropColumn('product_id');
            }
            if(Schema::hasColumn('claims','volume_total_bbg')){
                $table->dropColumn('volume_total_bbg');
            }
            if(Schema::hasColumn('claims','volume_total_builder')){
                $table->dropColumn('volume_total_builder');
            }
            if(Schema::hasColumn('claims','rebate_total_builder')){
                $table->dropColumn('rebate_total_builder');
            }
            if(Schema::hasColumn('claims','rebate_total_bbg')){
                $table->dropColumn('rebate_total_bbg');
            }
            if(Schema::hasColumn('claims','paid_total')){
                $table->dropColumn('paid_total');
            }
            if(Schema::hasColumn('claims','amount_owed_bbg')){
                $table->dropColumn('amount_owed_bbg');
            }
            if(Schema::hasColumn('claims','amount_owed_builder')){
                $table->dropColumn('amount_owed_builder');
            }
            if(Schema::hasColumn('claims','claim_paid_bbg')){
                $table->dropColumn('claim_paid_bbg');
            }
            if(Schema::hasColumn('claims','claim_paid_builder')){
                $table->dropColumn('claim_paid_builder');
            }
            if(Schema::hasColumn('claims','lost_disbute_bbg')){
                $table->dropColumn('lost_disbute_bbg');
            }
            if(Schema::hasColumn('claims','lost_disbute_builder')){
                $table->dropColumn('lost_disbute_builder');
            }
            if(Schema::hasColumn('claims','lost_type')){
                $table->dropColumn('lost_type');
            }
            if(Schema::hasColumn('claims','lost_description')){
                $table->dropColumn('lost_description');
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
        if (!Type::hasType('double')) {
            Type::addType('double', FloatType::class);
        }

        //
        Schema::dropIfExists('claims');

        Schema::create('claims', function (Blueprint $table) {
            $table->id();
            $table->mediumText('name')->nullable();
            $table->enum('claim_type',['rebate','volume'])->nullable(false);
            $table->date('claim_start');
            $table->date('claim_end');
            $table->enum('report_period',['quarter','yearly'])->nullable(false);
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->double('claim_total_bbg',10,2)->nullable();
            $table->double('claim_total_builders',10,2)->nullable();
            $table->string('claim_status')->nullable(false);
            $table->foreignId('program_id')->constrained('programs')->cascadeOnDelete();
            //$table->unsignedBigInteger('house_id');
            $table->foreignId('house_id')->constrained('houses')->cascadeOnDelete();
            $table->string('CO'); //Certificate of occupancy, will be a file
            $table->unsignedBigInteger('product_id');
            $table->double('volume_total_bbg',10,2)->nullable();
            $table->double('volume_total_builder')->nullable();
            $table->double('rebate_total_bbg',10,2)->nullable();
            $table->double('rebate_total_builder',10,2)->nullable();
            $table->double('paid_total',10,2)->nullable();
            $table->double('amount_owed_bbg',10,2)->nullable();
            $table->double('amount_owed_builder',10,2)->nullable();
            $table->double('claim_paid_bbg',10,2)->nullable();
            $table->double('claim_paid_builder',10,2)->nullable();
            $table->double('lost_disbute_bbg',10,2)->nullable();
            $table->double('lost_disbute_builder',10,2)->nullable();
            $table->string('lost_type')->nullable();
            $table->text('lost_description')->nullable();
            $table->bigInteger("created_by")->nullable();
            $table->bigInteger("updated_by")->nullable();
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }
}
