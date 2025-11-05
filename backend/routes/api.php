<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



Route::post('/register',[AccountController::class,'register']);
Route::post('/login',[AccountController::class,'authenticate']);
Route::middleware('auth:sanctum')->post('/courses', [CourseController::class, 'store']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
