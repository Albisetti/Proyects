<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsersTableAddWordPressDetails extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->change();
            $table->string('last_name')->nullable()->change();
            $table->string('mobile_number')->nullable()->change();

            $table->string('wordpress_username', 128);
            $table->integer('wordpress_id');

            $table->index('wordpress_id');
            $table->index('wordpress_username');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('wordpress_id');
            $table->dropIndex('wordpress_username');

            $table->dropColumn([
                'wordpress_id', 
                'wordpress_username'
            ]);

            $table->string('first_name')->nullable(false)->change();
            $table->string('last_name')->nullable(false)->change();
            $table->string('mobile_number')->nullable(false)->change();
        });
    }
}
