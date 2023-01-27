<?php

namespace Database\Seeders;

use App\Models\Houses;
use App\Models\Property;
use Illuminate\Database\Seeder;

class PropertiesHousesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Property::factory()->count(30)->create()->each(function(Property $property){
            $random = rand(1,5);
            $houses = Houses::factory()->count($random)->create()->pluck('id');
//            $property->houses()->attach($houses);
        });
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
