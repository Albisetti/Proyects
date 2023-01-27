<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testBasicTest()
    {
		$response = $this->graphQL(/** @lang GraphQL */ '
			query {
				volumeProgramAllocations(input: { 
					programs: [1], 
					builderRebates: [{ 
						id: 2, 
						rebate: 500 
					}], 
					spendToDate: 500, 
					totalRebate: 500 
				}) {
				  	builders {
						builder {
						id
						}
						rebate
						contribution
				  	}
				  	rebatedTotal
				}
			}
		')->assertJson([
			"data" => [
				"volumeProgramAllocations" => [
					"builders" => [
						[
							"builder" => [
								"id" => "2"
							],
							"rebate" => 0,
							"contribution" => 500
						]
					],
					"rebatedTotal" => 500
				]
			]
		]);
    }
}
