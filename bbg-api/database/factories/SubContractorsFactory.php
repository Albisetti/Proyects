<?php

namespace Database\Factories;

use App\Models\Organizations;
use App\Models\Addresses;
use App\Models\SubContractors;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubContractorsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SubContractors::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $address = Addresses::factory()->count(1)->create()->first();
        $organization = Organizations::all()->random(1)->first();

        return [
            'organization_id' => $organization->id,
            'company_name' => $this->faker->company,
            'contact_name' => $this->faker->name,
            'email'        => $this->faker->email,
            'office_number' => rand(0,1) ? $this->faker->e164PhoneNumber : null,
            'mobile_number' => rand(0,1) ? $this->faker->phoneNumber : null,
            'address_id'     => $address->id
        ];
    }
}
