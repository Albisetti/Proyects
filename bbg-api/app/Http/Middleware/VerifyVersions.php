<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyVersions
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
        $apiVersion = env('API_BBG_VERSION', false);
        $webAppVersion = env('APP_BBG_VERSION', false);

        $response = $next($request);
        $response->header('X-API-BBG-Version', $apiVersion);
        $response->header('X-APP-BBG-Version', $webAppVersion);
        return $response;
    }
}
