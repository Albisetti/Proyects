<?php

namespace Database\Seeders;

use App\Models\RequiredProofPoints;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Symfony\Contracts\Service\Attribute\Required;

class RequiredProofPointsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $json = File::get(base_path("database/data/required_proof_points.json"));
        $data = json_decode($json, true);

        foreach ($data as $value) {
            RequiredProofPoints::query()->create([
                'proof_name' => $value
            ]);
        }
    }
}
