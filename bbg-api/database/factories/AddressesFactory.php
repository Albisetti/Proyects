<?php

namespace Database\Factories;

use App\Models\Addresses;
use Illuminate\Database\Eloquent\Factories\Factory;

class AddressesFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Addresses::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'address' => $this->faker->address,
            'address2' => $this->faker->secondaryAddress,
            'city' => $this->faker->city,
            'state_id' => $this->faker->randomDigit,
            'lot_number' => $this->faker->randomDigit,
            'zip_postal' => $this->faker->postcode
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Addresses $address) {
            //$address->houses()->save(Houses::factory()->create(50));
        });
    }
}
