<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(StateCitySeeder::class);
        $this->call(AdminUserSeeder::class);
//        $this->call(SubdivisionSystemSeeder::class);
        //$this->call(HousesSeeder::class);
//        $this->call(PropertiesHousesSeeder::class);
//        $this->call(AssociatingProductsToProgramSeeder::class);
        //$this->call(SubContractorsSeeder::class);
//        $this->call(RequiredProofPointsSeeder::class); //TODO: wasn't this move to fields on report?
    }

    /**
     * Seed the given connection from the given path.
     *
     * @param string $class
     * @param bool   $silent
     * @param array  $parameters
     *
     * @return void
     */
    public function call($class, $silent = false, array $parameters = [])
    {
        $start = microtime(true);
        $this->resolve($class)->run();

        if (isset($this->command)) {
            $this->command->getOutput()
                ->writeln(
                    sprintf(
                        '<info>Seeded:</info> %-40s seconds: [<info>%3.2f</info>]',
                        $class,
                        microtime(true) - $start
                    )
                );
        }
    }
}
