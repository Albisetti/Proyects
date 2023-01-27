<?php

use App\Models\Programs;
use App\Models\ProgramDocument;
use Faker\Factory;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProgramDocumentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('program_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('program_id')->index()->constrained('programs')->cascadeOnDelete();
            $table->string('path', 256)->nullable();
            $table->bigInteger("created_by")->nullable();
            $table->bigInteger("updated_by")->nullable();
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updated_at')->default(\DB::raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });

        //fresh migration will automatically add documents with Factory...
//        Programs::query()->get()->each(function($program){
//            for($i=0; $i<=rand(1,5); $i++) {
//                $faker = Factory::create();
//                ProgramDocument::query()->create([
//                    'program_id' => $program->id,
//                    'path' => $faker->imageUrl(500,500,'property')
//                ]);
//            }
//        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('program_documents');
    }
}
