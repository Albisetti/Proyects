<?php

namespace Database\Seeders;

use App\Models\SubContractors;
use Illuminate\Database\Seeder;

class SubContractorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SubContractors::factory()->count(100)->create();
    }
}
