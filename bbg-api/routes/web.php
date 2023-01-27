<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\IndexController;
use App\Http\Controllers\UtilityController;

Route::middleware(['web'])->group(function() {
	Route::get('/', [IndexController::class, 'index']);

    /* CSV exports */
//    Route::post('/csv/factoryClaims', [UtilityController::class, 'generateFactoryClaimsSpreadsheet']);
//    Route::post('/csv/allocations', [UtilityController::class, 'generateAllocationSpreadsheet']);
});
