<?php


namespace Database\Factories;

use App\Models\ProductImages;
use App\Models\Products;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class ProductsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Products::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {

        $status = ["UNDER CONSTRUCTION","COMPLETED","STARTING","PRE-CONSTRUCTION"];

        return [
            'bbg_product_code' => Str::random(10),
            'name' => $this->faker->unique()->name,
//            'quantity' => rand(10,999),
            'description' => $this->faker->paragraph(5),
            'rule_id' => null,
            'category_id' => $this->faker->numberBetween(0, 100)
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure()
    {
        return $this->afterCreating(function (Products $product) {
              ProductImages::factory()->count(rand(1,5))->create([
                  'product_id' => $product->id
              ]);
//            $product->houses()->create([
//                'square_footage' => rand(1000,9999),
//                'expected_completion_date' => Carbon::now()->addDays(rand(19,99)),
//                'status' => '',
//                'organization_id' => rand(1,3),
//                'address_id' => rand(1,4),
//                'product_id' => $product->id,
//                'property_id' => 1,
//                'purchase_order_id' => null,
//            ]);
        });
    }
}
