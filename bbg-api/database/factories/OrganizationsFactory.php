<?php

namespace Database\Factories;

use App\Models\Organizations;
use App\Models\Programs;
use App\Models\Addresses;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OrganizationsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Organizations::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $type = ['builders','bbg','manufacturers','distributers','suppliers'];
        $tier = ['none','gold','silver','bronze'];

//        $program = Programs::factory()->count(1)->create()->first();
        $address  = Addresses::factory()->count(1)->create()->first();

        return [
            'organization_type' => collect($type)->random(1)->first(),
            'name' => $this->faker->name,
            'abbreviation' => Str::random(5),
            'code' => Str::random(5),
            'address' => $this->faker->address,
            'address2' => $this->faker->secondaryAddress,
            'city' => $this->faker->city,
            'state_id' => $this->faker->numberBetween(1,50),
            'zip_postal' => $this->faker->postcode,
            'phone_number' => $this->faker->phoneNumber,
            'approved_states' => $this->faker->state,
            'notes' => $this->faker->paragraph(10),
            'member_tier' => collect($tier)->random(1)->first(),
//            'program_id'  => $program->id,
            'average_sq_footage' => rand(1000,99999)
        ];
    }
}
