<?php

namespace Database\Seeders;

use App\Models\Products;
use App\Models\Programs;
use Illuminate\Database\Seeder;
use Faker\Factory;

class AssociatingProductsToProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Programs::all()->each(function(Programs $program){
            $faker = Factory::create();
            $products = Products::all()->random(rand(1,10))->pluck('id');
            $program->products()->attach($products,[
                'minimum_unit' => $faker->numberBetween(0,1000),
                'require_quantity_reporting' => $faker->boolean(),
                'residential_rebate_amount' => $faker->numberBetween(0,1000) . '.' . $faker->numberBetween(0,99),
                'multi_unit_rebate_amount' => $faker->numberBetween(0,1000) . '.' . $faker->numberBetween(0,99),
                'commercial_rebate_amount' => $faker->numberBetween(0,1000) . '.' . $faker->numberBetween(0,99),
                'multi_reporting' => $faker->boolean(),
            ]);
        });
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
