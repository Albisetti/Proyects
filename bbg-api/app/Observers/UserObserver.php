<?php

namespace App\Observers;

use App\Jobs\UserCreatedJobHandler;
use App\Jobs\UserJobHandler;
use App\Models\User;

class UserObserver
{
    /**
     * Handle the User "created" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function created(User $user)
    {
        if(!$user->user_password_set) {
            dispatch(new UserCreatedJobHandler($user))->onQueue('email');
        }
    }


    /**
     * Handle the User "updated" event.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    public function updated(User $user)
    {
        $changes = $user->getChanges();

        if(isset($changes["user_password_set"]) && $changes["user_password_set"] === true) {
            dispatch(new UserJobHandler($user))->onQueue('email');
        }
    }
}
