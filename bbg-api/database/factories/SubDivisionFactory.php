<?php

namespace Database\Factories;

use App\Models\Houses;
use App\Models\SubDivision;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubDivisionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = SubDivision::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->state
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        //associating houses to sub-division and sub-division associated to property
        return $this->afterCreating(function (SubDivision $subDivision) {
//            $random = rand(1,3);
//            $houses = Houses::factory()->count($random)->create()->pluck('id');
//            $subDivision->houses()->attach($houses);
        });
    }
}
