<?php

namespace Database\Seeders;

use App\Models\SubDivision;
use App\Models\SubdivisionSystem;
use Illuminate\Database\Seeder;

class SubdivisionSystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            SubdivisionSystem::factory()->count(1)->create()->each(function(SubdivisionSystem $subdivisionSystem){
                $single_build_subdivision = SubDivision::factory()->count(1)->create([
                    'name' => 'Single Build'
                ])->first();

                $subdivisionSystem->subdivision_id = $single_build_subdivision->id;
                $subdivisionSystem->save();
            });
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
