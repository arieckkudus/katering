<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MenuitemController;
use App\Http\Controllers\ProfilemerchantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::get('/login', function(){
    return response()->json('Login Dulu', 403);
})->name('login');
Route::post('/register', [AuthController::class, 'register']);



Route::middleware('auth:sanctum')->group(function () {
//profile merchant

// Get User
Route::get('/get-user', [AuthController::class, 'getuser']);

Route::get('/profilemerchant/get', [ProfilemerchantController::class, 'profilemerchantget']);
Route::get('/profilemerchant/{id}/get', [ProfilemerchantController::class, 'profilemerchantgetid']);
Route::post('/profilemerchant/create', [ProfilemerchantController::class, 'profilemerchantcreate']);
Route::put('/profilemerchant/{id}/edit', [ProfilemerchantController::class, 'profilemerchantUpdate']);
Route::post('/profilemerchant/{id}/delete', [ProfilemerchantController::class, 'profilemerchantDelete']);

//menu item
Route::get('/menuitem/get', [MenuitemController::class, 'menuitemget']);
Route::get('/menuitem/{id}/get', [MenuitemController::class, 'menuitemgetid']);
Route::get('/menuitem/profilemerchant', [MenuitemController::class, 'menuitemprofilemerchant']);
Route::post('/menuitem/create', [MenuitemController::class, 'menuitemcreate']);
Route::post('/menuitem/{id}/edit', [MenuitemController::class, 'menuitemUpdate']);
Route::post('/menuitem/{id}/delete', [MenuitemController::class, 'menuitemdelete']);


// Customer

Route::get('/customer/pencarian', [CustomerController::class, 'search']);
Route::post('/customer/{id_menuitem}/checkout', [CustomerController::class, 'checkOut']);
Route::get('/customer/{id_checkout}/invoice', [CustomerController::class, 'invoice']);




});
