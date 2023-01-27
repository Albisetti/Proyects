<?php

namespace Database\Seeders;

use App\Models\Addresses;
use App\Models\Role;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Factory::create();
        $adminUser = User::query()->updateOrCreate([
            'title'      => 'Mr',
            'type'       => 'admin',
            'first_name' => 'Splice',
            'last_name' => 'Digital',
            'email' => env('ADMIN_USER_EMAIL','admin@splicedigital.com'),
        ],[
            'mobile_phone'  => $faker->phoneNumber,
            'password' => Hash::make("password"), // password
            'wordpress_username' => 'splice',
            'wordpress_id' => 1
        ]);
    }
}
