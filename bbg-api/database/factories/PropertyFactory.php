<?php

namespace Database\Factories;

use App\Models\Organizations;
use App\Models\Property;
use App\Models\SubDivision;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Property::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $organization = Organizations::factory()->count(1)->create()->first();

        return [
            'name' => $this->faker->name
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Property $property) {
            SubDivision::factory()->count(1)->create([
                'property_id' => $property->id
            ]);
        });
    }


}
