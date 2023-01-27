<?php

namespace Database\Seeders;

use App\Models\Addresses;
use App\Models\State;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class StateCitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        $faker = Factory::create();
        $json = File::get(base_path("database/data/states_cities.json"));//TODO: confirm states add Can Provinces & Territories
        $stateCities = json_decode($json, true);

        foreach($stateCities as $state => $data) {
            $state = State::query()->create([
                'name' => $state,
                'iso_code' => $data['iso_code'],
                'country' => $data['country_iso_code']
            ]);

            if ( isset($data['cities']) && !empty($data['cities']) ) {
                $c = [];
                foreach ($data['cities'] as $city) {
                    $c[] = ['name' => $city];
                }

                $cities = $state->cities()->createMany($c);
            }
        }

        //TODO: confirm if working (I'm seeing 0s)
//        foreach (Addresses::all() as $address ){
//            $address->update([
//                "city_id" => $cities->random()->id
//            ]);
//        }
    }
}
