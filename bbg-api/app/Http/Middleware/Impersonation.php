<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Impersonation
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->attributes->get('sanctum') !== true) {
            return $next($request);
        }


		/* 
		 * Allow Sanctum and laravel-impersonate to coexist by authenticating
		 * the web guard auth as the impersonated user before Sanctum acts with it.
		 * 
		 * We'll also use this opportunity to insert the original impersonator.
		 */
        if ($request->hasSession() && $request->session()->has('impersonate')) {
            Auth::guard('web')
				->onceUsingId($request->session()->get('impersonate'));
        }

        return $next($request);
    }
}