<?php


namespace Database\Seeders;


use App\Models\Products;
use Illuminate\Database\Seeder;
use Faker\Factory;
use Illuminate\Support\Facades\Hash;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //$faker = Factory::create();
        Products::factory()->count(300)->create();

    }
}
