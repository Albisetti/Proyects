<?php

namespace Database\Factories;

use App\Models\Houses;
use App\Models\Organizations;
use App\Models\Programs;
use App\Models\ProgramDocument;
use App\Models\Addresses;
use App\Models\State;
use App\Models\SubDivision;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProgramsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Programs::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        /*
         * Factory Rebate Program
         * Volume Rebate Program
         */
        $type = ["factory","volume"];

        /*
         * Factory Rebate (Program Unit)
         *  - Per Property Rebate
         *  - Per Unit Rebate
         * Volume Rebate (Program unit)
         *  - Volume
         */
        $units = ["per_house","unit","volume"];

        $address = Addresses::factory()->count(1)->create()->first();

        return [
            'type'          => collect($type)->random(1)->first(),
            'name'          => $this->faker->name,
            'start_date'          => $this->faker->date(),
            'end_date'          => $this->faker->date(),
            'all_builder_report_quantity' => $this->faker->boolean(),
            'bbg_rebate_unit' => collect(['Per Unit', 'Per Install Unit'])->random(1)->first(),
            'lot_and_address_requirement' => collect(['Address Only', 'Address Or Lot', 'Address Or Lot With Subdivision'])->random(1)->first(),
            'require_certificate_occupancy' => $this->faker->boolean(),
            'require_subcontractor_provider' => $this->faker->boolean(),
            'require_brand' => $this->faker->boolean(),
            'require_serial_number' => $this->faker->boolean(),
            'require_model_number' => $this->faker->boolean(),
            'require_date_of_installation' => $this->faker->boolean(),
            'require_date_of_purchase' => $this->faker->boolean(),

            'internal_description'  => $this->faker->text,
            'builder_description'   => $this->faker->text,
            'learn_more_url'         => $this->faker->url,
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
        return $this->afterCreating(function (Programs $program) {
            for($i=0; $i<=rand(1,5); $i++) {
                ProgramDocument::query()->create([
                    'program_id' => $program->id,
                    'path' => $this->faker->imageUrl()
                ]);
            }
            $states = State::query()->get()->random(rand(1,10))->pluck('id');
            $program->regions()->attach($states);
        });
    }
}
