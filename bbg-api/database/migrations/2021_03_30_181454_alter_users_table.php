<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\File;

class AlterUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if(!Schema::hasColumn('users','type')) {
                    $json = File::get(base_path("database/data/roles.json"));
                    $roles = json_decode($json, true);

                    //$table->enum('type', ['admin', 'executive', 'builders', 'territory', 'manufacturer', 'suppliers', 'distributors', 'member', 'contractor'])->after('id')->nullable(false);
                    $table->enum('type', collect($roles)->pluck('name')->toArray())->after('id')->nullable(false);
                }
                if(!Schema::hasColumn('users','title')) {
                    $table->string('title')->after('type');
                }
                if(!Schema::hasColumn('users','last_name')) {
                    $table->string('last_name')->after('name');
                }
                if(!Schema::hasColumn('users','mobile_number')) {
                    $table->string('mobile_number')->after('password');
                }
                if(!Schema::hasColumn('users','office_phone')) {
                    $table->string('office_phone')->default('')->after('mobile_number');
                }
                if(!Schema::hasColumn('users','status')) {
                    $table->enum('status',['active','inactive','blocked','deleted'])->after('remember_token');
                }
                if(!Schema::hasColumn('users','address_id')) {
                    $table->foreignId('address_id')->index()->constrained('addresses')->cascadeOnDelete();
                }
                if(Schema::hasColumn('users','name')) {
                    $table->dropColumn('name');
                    if(!Schema::hasColumn('users','first_name')) {
                        $table->string('first_name')->nullable(false)->after('title');
                    }
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if(Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if(Schema::hasColumn('users','type')) {
                    $table->dropColumn('type');
                }
                if(Schema::hasColumn('users','title')) {
                    $table->dropColumn('title');
                }
                if(Schema::hasColumn('users','last_name')) {
                    $table->dropColumn('last_name');
                }
                if(Schema::hasColumn('users','mobile_number')) {
                    $table->dropColumn('mobile_number');
                }
                if(Schema::hasColumn('users','office_phone')) {
                    $table->dropColumn('office_phone');
                }
                if(Schema::hasColumn('users','first_name')) {
                    $table->dropColumn('first_name');
                    if(!Schema::hasColumn('users','name')) {
                        $table->string('name')->nullable(false)->after('id');
                    }
                }
                if(Schema::hasColumn('users','address_id')) {
                    $table->dropConstrainedForeignId('address_id');
                }
                if(Schema::hasColumn('users','status')) {
                    $table->dropColumn('status');
                }
            });
        }
    }
}
