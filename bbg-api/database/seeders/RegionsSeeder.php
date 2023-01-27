<?php


namespace Database\Seeders;


use App\Models\Products;
use App\Models\Addresses;
use Illuminate\Database\Seeder;
use Faker\Factory;
use Illuminate\Support\Facades\Hash;

class RegionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //$faker = Factory::create();
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Addresses::factory()->count(300)->create();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
