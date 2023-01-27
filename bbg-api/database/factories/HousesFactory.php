<?php

namespace Database\Factories;

use App\Models\Houses;
use App\Models\Organizations;
use App\Models\Products;
use App\Models\Programs;
use App\Models\Addresses;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class HousesFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Houses::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $type = ["UNDER CONSTRUCTION","COMPLETED","DEMOLISHED","PRE-CONSTRUCTION","NEW"];
        /*
        return [
            'square_footage' => rand(1000,9999),
            'expected_completion_date' => Carbon::now()->addDays(rand(19,99)),
            'status' => '',
            'organization_id' => Organizations::factory()->count(1)->create()->id,
            'address_id' => Addresses::factory()->count(1)->create(),
            'product_id' => Products::factory()->count(10)->create(),
            'property_id' => 1,
            'purchase_order_id' => null,
        ];
        */

        $organization = Organizations::factory()->count(1)->create()->first();
        $address = Addresses::factory()->count(1)->create()->first();

        return [
            'square_footage' => rand(1000,9999),
            'expected_completion_date' => Carbon::now()->addDays(rand(19,99)),
            'organization_id' => $organization->id,
            'purchase_order_id' => null,
        ];

    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        //creating and associating products to houses
        return $this->afterCreating(function (Houses $houses) {
//            $products = Products::factory()->count(rand(1,10))->create()->pluck('id');
//            $houses->products()->attach($products);
        });
    }
}
