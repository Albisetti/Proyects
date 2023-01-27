<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Doctrine\DBAL\Types\FloatType;
use Doctrine\DBAL\Types\Type;

class CreateOrganizationCustomProducts extends Migration
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

        Schema::create('organization_customProducts', function (Blueprint $table) {
            $table->id();

            $table->foreignId("organization_id")->nullable()->constrained('organizations')->cascadeOnDelete();
            $table->foreignId("program_id")->nullable()->constrained('programs')->cascadeOnDelete();
            $table->foreignId("product_id")->nullable()->constrained('products')->cascadeOnDelete();

            $table->enum('overwrite_amount_type', ['percentage', 'amount', 'tier'])->default('tier')->nullable();
            $table->double('residential_rebate_overwrite')->nullable();
            $table->double('multi_unit_rebate_overwrite')->nullable();
            $table->double('commercial_rebate_overwrite')->nullable();

            $table->bigInteger("created_by")->nullable();
            $table->bigInteger("updated_by")->nullable();
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('organization_customProducts');
    }
}
